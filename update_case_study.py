import os

base_dir = r"c:\fullstack\htdocs\operating_system_enh"

replacements = [
    (
        '<li><a href="group-policies.html">Part 8: Group Policies</a></li>',
        '<li><a href="group-policies.html">Part 8: Group Policies</a></li><li><a href="windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
    ),
    (
        '<li><a href="case-study/group-policies.html">Part 8: Group Policies</a></li>',
        '<li><a href="case-study/group-policies.html">Part 8: Group Policies</a></li><li><a href="case-study/windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
    ),
    (
        '<li><a href="../case-study/group-policies.html">Part 8: Group Policies</a></li>',
        '<li><a href="../case-study/group-policies.html">Part 8: Group Policies</a></li><li><a href="../case-study/windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
    )
]

count = 0
for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html') and f != 'windows-deployment-services.html':
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original_content = content
            for old, new in replacements:
                content = content.replace(old, new)
                
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Updated {count} HTML files successfully.")
