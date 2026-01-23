/**
 * Link Crawler Script
 * Crawls localhost:3000 and verifies all internal links
 */

const BASE_URL = 'http://localhost:3000';

// External domains to skip
const EXTERNAL_DOMAINS = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'wa.me',
  'whatsapp.com',
  't.me',
  'telegram.org',
];

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'LinkCrawler/1.0',
      },
    });
    const body = await response.text();
    return {
      status: response.status,
      body,
      ok: response.ok,
    };
  } catch (error) {
    return {
      status: 0,
      body: '',
      ok: false,
      error: error.message,
    };
  }
}

function extractLinks(html) {
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  const links = new Set();
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    links.add(match[1]);
  }

  return Array.from(links);
}

function isExternalLink(href) {
  // Check if it's a full URL to an external domain
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href);
      // Check if it's our localhost
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return false;
      }
      // Check against external domains list
      return EXTERNAL_DOMAINS.some(domain => url.hostname.includes(domain)) ||
             !url.hostname.includes('localhost');
    } catch {
      return true;
    }
  }

  // Skip mailto, tel, javascript, and anchor links
  if (href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('#')) {
    return true;
  }

  return false;
}

function normalizeUrl(href) {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return url.pathname + url.search;
      }
    } catch {
      return href;
    }
  }
  return href;
}

function isContentBroken(body, status, url) {
  if (!body || body.trim() === '') {
    return { broken: true, reason: 'Empty body' };
  }

  const lowerBody = body.toLowerCase();

  // Skip content checks for the homepage - it's never "broken" content-wise
  if (url === '/' || url === BASE_URL || url === BASE_URL + '/') {
    return { broken: false };
  }

  // Check for Shopify/Hydrogen "not found" page patterns
  // These typically have a specific structure indicating the resource doesn't exist
  if (lowerBody.includes('page not found') ||
      lowerBody.includes('this page does not exist') ||
      lowerBody.includes('couldn\'t find')) {
    return { broken: true, reason: 'Page not found content' };
  }

  // Check for collection/product not found (Shopify returns 200 but with error content)
  if ((lowerBody.includes('collection') || lowerBody.includes('product')) &&
      lowerBody.includes('not found')) {
    return { broken: true, reason: 'Resource not found' };
  }

  return { broken: false };
}

async function crawlAndVerify() {
  console.log('🔍 Link Crawler Starting...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  console.log('=' .repeat(60) + '\n');

  // Step 1: Fetch homepage
  console.log('📥 Fetching homepage...\n');
  const homepage = await fetchPage(BASE_URL);

  if (!homepage.ok) {
    console.error('❌ FATAL: Could not fetch homepage!');
    console.error(`   Status: ${homepage.status}`);
    if (homepage.error) {
      console.error(`   Error: ${homepage.error}`);
    }
    console.error('\n⚠️  Make sure your dev server is running: npm run dev\n');
    process.exit(1);
  }

  console.log(`✅ Homepage fetched successfully (Status: ${homepage.status})\n`);

  // Step 2: Extract links
  const allLinks = extractLinks(homepage.body);
  console.log(`📝 Found ${allLinks.length} total links on homepage\n`);

  // Step 3: Filter internal links
  const internalLinks = allLinks
    .filter(link => !isExternalLink(link))
    .map(link => normalizeUrl(link))
    .filter((link, index, self) => self.indexOf(link) === index); // Remove duplicates

  const externalLinks = allLinks.filter(link => isExternalLink(link));

  console.log(`🔗 Internal links to verify: ${internalLinks.length}`);
  console.log(`🌐 External links (skipped): ${externalLinks.length}\n`);
  console.log('=' .repeat(60) + '\n');

  // Step 4: Verify each internal link
  const results = {
    good: [],
    broken: [],
    errors: [],
  };

  for (const link of internalLinks) {
    const fullUrl = link.startsWith('http') ? link : `${BASE_URL}${link.startsWith('/') ? '' : '/'}${link}`;

    const result = await fetchPage(fullUrl);

    if (result.error) {
      results.errors.push({ link, error: result.error });
      console.log(`⚠️  [ERR] ${link} - ${result.error}`);
    } else if (result.status >= 400) {
      results.broken.push({ link, status: result.status });
      console.log(`❌ [${result.status}] ${link} (BROKEN LINK DETECTED)`);
    } else {
      const contentCheck = isContentBroken(result.body, result.status, link);
      if (contentCheck.broken) {
        results.broken.push({ link, status: result.status, reason: contentCheck.reason });
        console.log(`❌ [${result.status}] ${link} (${contentCheck.reason})`);
      } else {
        results.good.push({ link, status: result.status });
        console.log(`✅ [${result.status}] ${link}`);
      }
    }
  }

  // Step 5: Print summary report
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 SUMMARY REPORT\n');
  console.log(`   ✅ Working links: ${results.good.length}`);
  console.log(`   ❌ Broken links:  ${results.broken.length}`);
  console.log(`   ⚠️  Errors:       ${results.errors.length}`);
  console.log(`   📝 Total checked: ${internalLinks.length}`);

  if (results.broken.length > 0) {
    console.log('\n' + '=' .repeat(60));
    console.log('\n🚨 BROKEN LINKS FOUND:\n');
    results.broken.forEach(({ link, status, reason }) => {
      console.log(`   ❌ ${link}`);
      console.log(`      Status: ${status}${reason ? ` | Reason: ${reason}` : ''}`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\n' + '=' .repeat(60));
    console.log('\n⚠️  CONNECTION ERRORS:\n');
    results.errors.forEach(({ link, error }) => {
      console.log(`   ⚠️  ${link}`);
      console.log(`      Error: ${error}`);
    });
  }

  if (results.broken.length === 0 && results.errors.length === 0) {
    console.log('\n🎉 All links are working correctly!\n');
  }

  console.log('=' .repeat(60) + '\n');

  // Return exit code based on results
  process.exit(results.broken.length + results.errors.length > 0 ? 1 : 0);
}

// Run the crawler
crawlAndVerify();
