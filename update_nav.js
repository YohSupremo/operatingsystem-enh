const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\fullstack\\htdocs\\operating_system_enh';

const oldWeb = path.join(rootDir, 'case-study', 'web.html');
const newWeb = path.join(rootDir, 'case-study', 'web-server.html');
if (fs.existsSync(oldWeb)) {
    fs.renameSync(oldWeb, newWeb);
}

function getPrefix(filepath) {
    const rel = path.relative(rootDir, filepath);
    const dirCount = rel.split(path.sep).length - 1;
    return dirCount > 0 ? '../'.repeat(dirCount) : '';
}

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(rootDir, function(filepath) {
    if (!filepath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    const prefix = getPrefix(filepath);
    
    // Update Web -> Web Server
    content = content.replace(/web\.html/g, 'web-server.html');
    content = content.replace(/Part 7: Web</g, 'Part 7: Web Server<');
    content = content.replace(/Part 7: Web"/g, 'Part 7: Web Server"');
    content = content.replace(/Part 7: Web &/g, 'Part 7: Web Server &');
    
    if (path.basename(filepath) === 'web-server.html') {
        content = content.replace('<title>Part 7: Web -', '<title>Part 7: Web Server -');
        content = content.replace('<h1>Part 7: Web</h1>', '<h1>Part 7: Web Server</h1>');
        content = content.replace('<span>Web</span>', '<span>Web Server</span>');
        content = content.replace('<h2>Overview</h2>\n          <p>Learn how to install and configure Internet Information Services (IIS) to turn your Windows Server into a fully functional web server', '<h2>Overview</h2>\n          <p>Learn how to install and configure Internet Information Services (IIS) to turn your Windows Server into a fully functional web server');
    }

    // Add Case Study dropdown if missing
    if (!content.includes(`href="${prefix}case-study.html"`)) {
        // Add after Activities desktop
        const activitiesDesktopRe = new RegExp(
            `(<li class="has-dropdown">\\s*<a href="${prefix.replace(/\./g, '\\.')}activities\\.html"[\\s\\S]*?</ul>\\s*</li>)`,
            'i'
        );
        const caseStudyDesktop = `
        <li class="has-dropdown">
          <a href="${prefix}case-study.html" class="nav-link">Case Study <span class="arrow">&#9662;</span></a>
          <ul class="dropdown-menu">
            <li><a href="${prefix}case-study/domain-controller.html">Part 1: Domain Controller</a></li>
            <li><a href="${prefix}case-study/adding-users.html">Part 2: Adding Users</a></li>
            <li><a href="${prefix}case-study/dhcp-server.html">Part 3: DHCP Server</a></li>
            <li><a href="${prefix}case-study/file-sharing.html">Part 4: File Sharing</a></li>
            <li><a href="${prefix}case-study/raid.html">Part 5: RAID</a></li>
            <li><a href="${prefix}case-study/remote-desktop.html">Part 6: Remote Desktop</a></li>
            <li><a href="${prefix}case-study/web-server.html">Part 7: Web Server</a></li>
            <li><a href="${prefix}case-study/group-policies.html">Part 8: Group Policies</a></li>
          </ul>
        </li>`;
        
        if (activitiesDesktopRe.test(content)) {
            content = content.replace(activitiesDesktopRe, `$1${caseStudyDesktop}`);
        }

        // Add after Activities mobile
        // Node regex doesn't support dotall flag (s) before ES2018 easily across all versions, so we use [\s\S]*?
        const activitiesMobileRe = new RegExp(
            `(<li class="mobile-has-dropdown">\\s*<button class="mobile-dropdown-toggle">[\\s\\S]*?(?:&#128221;|&amp;#128221;)\\s*Activities[\\s\\S]*?</button>\\s*<ul class="mobile-sub-menu">[\\s\\S]*?</ul>\\s*</li>)`,
            'i'
        );
        const caseStudyMobile = `
        <li class="mobile-has-dropdown">
          <button class="mobile-dropdown-toggle">&#128218; Case Study <span class="arrow">&#9662;</span></button>
          <ul class="mobile-sub-menu">
            <li><a href="${prefix}case-study.html">View All Case Study &rarr;</a></li>
            <li><a href="${prefix}case-study/domain-controller.html">Part 1: Domain Controller</a></li>
            <li><a href="${prefix}case-study/adding-users.html">Part 2: Adding Users</a></li>
            <li><a href="${prefix}case-study/dhcp-server.html">Part 3: DHCP Server</a></li>
            <li><a href="${prefix}case-study/file-sharing.html">Part 4: File Sharing</a></li>
            <li><a href="${prefix}case-study/raid.html">Part 5: RAID</a></li>
            <li><a href="${prefix}case-study/remote-desktop.html">Part 6: Remote Desktop</a></li>
            <li><a href="${prefix}case-study/web-server.html">Part 7: Web Server</a></li>
            <li><a href="${prefix}case-study/group-policies.html">Part 8: Group Policies</a></li>
          </ul>
        </li>`;
        
        if (activitiesMobileRe.test(content)) {
            content = content.replace(activitiesMobileRe, `$1${caseStudyMobile}`);
        }
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
});
