import subprocess
import json
from pathlib import Path
p=Path('src/app/magnitude-session.js'); q=Path('src/app/app.js')
original=p.read_text(); app=q.read_text()
cases=[
('reordered entries',p,original,"comparison('plan45-compare-02'), comparison('plan45-compare-08')","comparison('plan45-compare-08'), comparison('plan45-compare-02')",['npx','vitest','run','tests/app-plan60-magnitude-session.test.js','--maxWorkers=1']),
('unwanted auto advance',p,original,'episode = next; return true;',"episode = next; if (next.status === 'resolved') snapshot = deepFreeze({ ...snapshot, index: snapshot.index + 1 }); return true;",['npx','vitest','run','tests/app-plan60-magnitude-session.test.js','--maxWorkers=1']),
('lost state on failed preparation',p,original,"} catch { return { ok: false, reason: 'preparation-failed' }; }","} catch { episode = null; return { ok: false, reason: 'preparation-failed' }; }",['npx','vitest','run','tests/app-plan60-magnitude-session.test.js','--maxWorkers=1']),
('stale callback after edit',p,original,'transaction.snapshot !== snapshot || transaction.episode !== episode','false', ['npx','vitest','run','tests/app-plan60-magnitude-session.test.js','--maxWorkers=1']),
('durable session write',q,app,'  function startMagnitudeSession() {',"  function startMagnitudeSession() {\n    localStorage.setItem('plan60-session-progress', '0');",['node','reports/development/plan-60-short-magnitude-practice-session/evidence/browser-walk.mjs'])]
receipts=[]
try:
 for name,path,src,old,new,cmd in cases:
  assert old in src, name
  path.write_text(src.replace(old,new,1))
  result=subprocess.run(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding="utf-8",errors="replace",timeout=90)
  detected = result.returncode != 0 and ('AssertionError' in result.stdout or 'FAIL ' in result.stdout)
  snippets = [line.strip() for line in result.stdout.splitlines() if 'AssertionError' in line or ' FAIL ' in line][:3]
  receipts.append({'mutation':name,'exit':result.returncode,'detected':detected,'assertions':snippets})
  print(name+': '+('DETECTED' if detected else 'NOT DETECTED')+' exit='+str(result.returncode),flush=True)
  path.write_text(src)
finally:
 p.write_text(original); q.write_text(app)
 Path('reports/development/plan-60-short-magnitude-practice-session/evidence/negative-controls.json').write_text(json.dumps(receipts,indent=2)+'\n')
