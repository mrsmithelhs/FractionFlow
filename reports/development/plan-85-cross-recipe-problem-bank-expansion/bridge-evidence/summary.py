import json
for r in json.load(open('observations.json')):
 a=r['acceptedAt360'];print(r['case']['name'],'viewport',a['viewport'],'content',a['contentWidth'],'axis',round(a['axisWidth'],1),'ticks',a['tickCount'],'minspace',round(a['minTickSpacing'],2),'overlap',a['labelOverlapIndices'],'scroll',a['scrollWidth'],'controls',[round(x['h']) for x in a['controlBoxes']],'selected',r['selectedResize'],'acceptedResize',r['acceptedResize'],'linear text',r['linearAt360']['text'].splitlines()[1])
