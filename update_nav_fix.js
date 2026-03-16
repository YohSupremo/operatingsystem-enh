const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\fullstack\\htdocs\\operating_system_enh';

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
    
    // Convert line endings to \n to make string replacement predictable
    content = content.replace(/\r\n/g, '\n');

    // Add Case Study dropdown if missing
    if (!content.includes(`href="${prefix}case-study.html"`)) {
        
        const desktopSearch = `<li><a href="${prefix}activities/windows-deployment-services.html">Windows Deployment Services</a></li>\n          </ul>\n        </li>`;

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
        
        const mobileSearch = `<li><a href="${prefix}activities/windows-deployment-services.html">Windows Deployment Services</a></li>\n          </ul>\n        </li>`;

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

        // Since desktopSearch and mobileSearch are identical in string content, we'll replace the first occurrence with desktop, second with mobile.
        // Let's do it safely by splitting.
        
        let parts = content.split(desktopSearch);
        if (parts.length === 3) {
            content = parts[0] + desktopSearch + caseStudyDesktop + parts[1] + desktopSearch + caseStudyMobile + parts[2];
        }
    }
    
    // Also fix any occurrences of 'web.html' in case-study files that already got the dropdown but still point to web.html
    content = content.replace(/web\.html/g, 'web-server.html');
    content = content.replace(/Part 7: Web</g, 'Part 7: Web Server<');
    content = content.replace(/Part 7: Web"/g, 'Part 7: Web Server"');
    content = content.replace(/Part 7: Web &/g, 'Part 7: Web Server &');
    
    fs.writeFileSync(filepath, content, 'utf8');
});
