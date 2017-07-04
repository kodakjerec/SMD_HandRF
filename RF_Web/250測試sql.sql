--解除車號
select * 
--update DCS_IDV set status=5
from DCS_IDV 
where ID='IDV16122000003'

--解除所單
SELECT * 
--update DCS_ID_LINE_TAG set E_TIME=null, status=0, Lock_By=null
FROM DCS_ID_LINE_TAG 
WHERE ID_ID='ID161220000002'
	--and ITEM_HOID='1161130111751'
