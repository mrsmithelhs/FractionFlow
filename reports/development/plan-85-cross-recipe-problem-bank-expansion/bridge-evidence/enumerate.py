from fractions import Fraction
from math import gcd
import json
rows=[]
for ds,whole_range in [([2,4,8],[1]),(list(range(2,11)),[1]),(list(range(2,11)),[1,2])]:
 forms=sum((d-1)*len(whole_range) for d in ds)
 reduced=sum(sum(gcd(n,d)==1 for n in range(1,d))*len(whole_range) for d in ds)
 amounts=len({Fraction(w)+Fraction(n,d) for w in whole_range for d in ds for n in range(1,d)})
 rows.append({'denominators':ds,'wholes':whole_range,'written_forms':forms,'reduced_forms':reduced,'distinct_exact_amounts':amounts,'per_denominator':{str(d):{'written_forms':(d-1)*len(whole_range),'reduced_forms':sum(gcd(n,d)==1 for n in range(1,d))*len(whole_range),'distinct_remainders':len({Fraction(n,d) for n in range(1,d)})} for d in ds}})
open('enumeration.json','w').write(json.dumps(rows,indent=2))
