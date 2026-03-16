import os
import re

root_dir = r"c:\fullstack\htdocs\operating_system_enh"

old_web = os.path.join(root_dir, "case-study", "web.html")
new_web = os.path.join(root_dir, "case-study", "web-server.html")
if os.path.exists(old_web):
    os.rename(old_web, new_web)

def get_prefix(filepath):
    rel = os.path.relpath(filepath, root_dir)
    dir_count = rel.count(os.sep)
    return "../" * dir_count if dir_count > 0 else ""

for root, _, files in os.walk(root_dir):
    for f in files:
        if not f.endswith('.html'): continue
        filepath = os.path.join(root, f)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        prefix = get_prefix(filepath)
        
        # Update Web -> Web Server
        content = content.replace("web.html", "web-server.html")
        content = content.replace("Part 7: Web<", "Part 7: Web Server<")
        content = content.replace("Part 7: Web\"", "Part 7: Web Server\"")
        content = content.replace("Part 7: Web &", "Part 7: Web Server &")
        
        if f == "web-server.html":
            content = content.replace("<title>Part 7: Web -", "<title>Part 7: Web Server -")
            content = content.replace("<h1>Part 7: Web</h1>", "<h1>Part 7: Web Server</h1>")
            content = content.replace("<span>Web</span>", "<span>Web Server</span>")
            content = content.replace("<h2>Overview</h2>\n          <p>Learn how to install and configure Internet Information Services (IIS) to turn your Windows Server into a fully functional web server", "<h2>Overview</h2>\n          <p>Learn how to install and configure Internet Information Services (IIS) to turn your Windows Server into a fully functional web server")

        # Add Case Study dropdown if missing
        if f'href="{prefix}case-study.html"' not in content:
            # Add after Activities desktop
            activities_desktop_re = re.compile(
                r'(<li class="has-dropdown">\s*<a href="' + re.escape(prefix) + r'activities\.html".*?</ul>\s*</li>)',
                re.DOTALL | re.IGNORECASE
            )
            case_study_desktop = f"""
        <li class="has-dropdown">
          <a href="{prefix}case-study.html" class="nav-link">Case Study <span class="arrow">&#9662;</span></a>
          <ul class="dropdown-menu">
            <li><a href="{prefix}case-study/domain-controller.html">Part 1: Domain Controller</a></li>
            <li><a href="{prefix}case-study/adding-users.html">Part 2: Adding Users</a></li>
            <li><a href="{prefix}case-study/dhcp-server.html">Part 3: DHCP Server</a></li>
            <li><a href="{prefix}case-study/file-sharing.html">Part 4: File Sharing</a></li>
            <li><a href="{prefix}case-study/raid.html">Part 5: RAID</a></li>
            <li><a href="{prefix}case-study/remote-desktop.html">Part 6: Remote Desktop</a></li>
            <li><a href="{prefix}case-study/web-server.html">Part 7: Web Server</a></li>
            <li><a href="{prefix}case-study/group-policies.html">Part 8: Group Policies</a></li>
          </ul>
        </li>"""
            if activities_desktop_re.search(content):
                content = activities_desktop_re.sub(r'\1' + case_study_desktop, content)

            # Add after Activities mobile
            activities_mobile_re = re.compile(
                r'(<li class="mobile-has-dropdown">\s*<button class="mobile-dropdown-toggle">.*?(?:&#128221;|&amp;#128221;)\s*Activities.*?</button>\s*<ul class="mobile-sub-menu">.*?</ul>\s*</li>)',
                re.DOTALL | re.IGNORECASE
            )
            case_study_mobile = f"""
        <li class="mobile-has-dropdown">
          <button class="mobile-dropdown-toggle">&#128218; Case Study <span class="arrow">&#9662;</span></button>
          <ul class="mobile-sub-menu">
            <li><a href="{prefix}case-study.html">View All Case Study &rarr;</a></li>
            <li><a href="{prefix}case-study/domain-controller.html">Part 1: Domain Controller</a></li>
            <li><a href="{prefix}case-study/adding-users.html">Part 2: Adding Users</a></li>
            <li><a href="{prefix}case-study/dhcp-server.html">Part 3: DHCP Server</a></li>
            <li><a href="{prefix}case-study/file-sharing.html">Part 4: File Sharing</a></li>
            <li><a href="{prefix}case-study/raid.html">Part 5: RAID</a></li>
            <li><a href="{prefix}case-study/remote-desktop.html">Part 6: Remote Desktop</a></li>
            <li><a href="{prefix}case-study/web-server.html">Part 7: Web Server</a></li>
            <li><a href="{prefix}case-study/group-policies.html">Part 8: Group Policies</a></li>
          </ul>
        </li>"""
            if activities_mobile_re.search(content):
                content = activities_mobile_re.sub(r'\1' + case_study_mobile, content)
                
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
