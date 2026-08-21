import sys

content = sys.stdin.read()
docs = content.split('<!doctype html>')

if len(docs) > 1:
    for i, doc in enumerate(docs[1:]):
        with open(f'public/page{i+1}.html', 'w') as f:
            f.write('<!doctype html>' + doc.split('</html>')[0] + '</html>\n')
