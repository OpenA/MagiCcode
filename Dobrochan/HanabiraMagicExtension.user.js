// ==UserScript==
// @name    		MagicScript Extension for Dobrochan Imageboard
// @description 	Включает в себя: Ajax подгрузку и отправку постов, Превращение рейтингов в спойлеры, Умные кнопки разметки и автокомплит, Поддержку встраивания медиа со множества ресурсов, а так же HTML5 Audio/Video/Image файлов по прямым ссылкам и много чего еще.
// @namespace   	magicode
// @homepage		https://github.com/OpenA/MagiCcode/Dobrochan
// @updateURL   	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraMagicExtension.user.js
// @downloadURL 	https://github.com/OpenA/MagiCcode/raw/master/Dobrochan/HanabiraMagicExtension.user.js
// @include 		*dobrochan.*
// @version 		0.5.3.1
// @grant   		none
// ==/UserScript==
var rp_arr = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMjMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxkZWZzPjxmaWx0ZXIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTEiPjxmZU9mZnNldCBkeD0iMCIgZHk9IjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41IiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVHYXVzc2lhbkJsdXI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNyAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdHlwZT0ibWF0cml4IiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIxIj48L2ZlTWVyZ2VOb2RlPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyI+PC9mZU1lcmdlTm9kZT48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xMi42NTg4OTc2LDUuOTkxNjcyMzkgTDExLjQ3MTM5NzYsOC4yOTUxNzk0MyBMMS43MjA3MDMxMiwxMi41OTc5NTY3IEwzLjAxMzc1ODY4LDguODYwMTkwNTkgTDkuMTIyNzg2NDYsNi43ODg0ODMgTDIuMTU2MTE5NzksMy44NDc1Mjc0NyBMNS40NTQ3MzA5LDIuMjUzOTA2MjUgTDEyLjY1ODg5NzYsNS45OTE2NzIzOSBaIE0yMC45MjMwMTc5LDUuOTkxNjcyMzkgTDE5LjczNTUxNzksOC4yOTUxNzk0MyBMOS45ODQ4MjM1LDEyLjU5Nzk1NjcgTDExLjI3Nzg3OTEsOC44NjAxOTA1OSBMMTcuMzg2OTA2OCw2Ljc4ODQ4MyBMMTAuNDIwMjQwMiwzLjg0NzUyNzQ3IEwxMy43MTg4NTEzLDIuMjUzOTA2MjUgTDIwLjkyMzAxNzksNS45OTE2NzIzOSBaIiBpZD0iPj4tY29weSIgZmlsbC1vcGFjaXR5PSIwLjQiIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNmaWx0ZXItMSkiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD48cGF0aCBkPSJNMTIuNjU4ODk3Niw0Ljk5MTY3MjM5IEwxMS40NzEzOTc2LDcuMjk1MTc5NDMgTDEuNzIwNzAzMTIsMTEuNTk3OTU2NyBMMy4wMTM3NTg2OCw3Ljg2MDE5MDU5IEw5LjEyMjc4NjQ2LDUuNzg4NDgzIEwyLjE1NjExOTc5LDIuODQ3NTI3NDcgTDUuNDU0NzMwOSwxLjI1MzkwNjI1IEwxMi42NTg4OTc2LDQuOTkxNjcyMzkgWiBNMjAuOTIzMDE3OSw0Ljk5MTY3MjM5IEwxOS43MzU1MTc5LDcuMjk1MTc5NDMgTDkuOTg0ODIzNSwxMS41OTc5NTY3IEwxMS4yNzc4NzkxLDcuODYwMTkwNTkgTDE3LjM4NjkwNjgsNS43ODg0ODMgTDEwLjQyMDI0MDIsMi44NDc1Mjc0NyBMMTMuNzE4ODUxMywxLjI1MzkwNjI1IEwyMC45MjMwMTc5LDQuOTkxNjcyMzkgWiIgaWQ9Ij4+IiBzdHJva2Utb3BhY2l0eT0iMC40IiBzdHJva2U9IiM5OTkiIGZpbGw9IiNGRkYiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD48L2c+PC9zdmc+",
cmove = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxjaXJjbGUgaWQ9Ik92YWwtMSIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIzIiBjeT0iMTciIHI9IjIiPjwvY2lyY2xlPjxjaXJjbGUgaWQ9Ik92YWwtMyIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxNyIgY3k9IjE3IiByPSIyIj48L2NpcmNsZT48Y2lyY2xlIGlkPSJPdmFsLTYiIGZpbGwtb3BhY2l0eT0iLjE1IiBmaWxsPSIjMDAwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiBjeD0iMTciIGN5PSIxMCIgcj0iMiI+PC9jaXJjbGU+PGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iIzAwMCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIgY3g9IjEwIiBjeT0iMTAiIHI9IjIiPjwvY2lyY2xlPjxjaXJjbGUgaWQ9Ik92YWwtOCIgZmlsbC1vcGFjaXR5PSIuMTUiIGZpbGw9IiMwMDAiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIGN4PSIxMCIgY3k9IjE3IiByPSIyIj48L2NpcmNsZT48Y2lyY2xlIGlkPSJPdmFsLTIiIGZpbGwtb3BhY2l0eT0iLjE1IiBmaWxsPSIjMDAwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiBjeD0iMTciIGN5PSIzIiByPSIyIj48L2NpcmNsZT48L2c+PC9zdmc+',
artwork = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iNTAwcHgiIGhlaWdodD0iNTAwcHgiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPjxzdG9wIHN0b3AtY29sb3I9IiNGRkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KPHN0b3Agc3RvcC1jb2xvcj0iI0Q0RDRENCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+PGcgaWQ9IkxheWVyLTEiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEsIC0xKSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSI+PHBhdGggZD0iTS0wLjc5ODY3OTg2OCwwLjAxNDQ0MDQzMzIgTDQ5OC44Mzk5MzQsMC4wMTQ0NDA0MzMyIEw0OTguODM5OTM0LDUwMC45MDk3NDcgTC0wLjc5ODY3OTg2OCw1MDAuOTA5NzQ3IEwtMC43OTg2Nzk4NjgsMC4wMTQ0NDA0MzMyIFoiIGlkPSJTaGFwZSIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPjwvZz48ZyBpZD0iIzAwMDAwMGZmIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDEsIDEwNikiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjA5Mzc1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNzciPjxwYXRoIGQ9Ik0yMTAuNDQ4MjUxLDAgQzIxMC40NjI2MjMsNjUuMTg2OTY4NiAyMTAuNDQyNTAzLDEzMC4zNzEwMzMgMjEwLjQ1OTc0OSwxOTUuNTU4MDAxIEMyMTQuMTgxOTI3LDE5NC4yMTAyODcgMjE4LjExMzkyOCwxOTMuNDk4NjcgMjIyLjA2NjA0OCwxOTMuMzk5OTE1IEMyMjEuNzE0LDE5My4zMzQ2NjcgMjI3LjA1MjY4NiwxOTMuNTU3NDkzIDIzMi43OTM2OTMsMTk1LjA3MDY4NCBDMjM3Ljc4NjM4NywxOTYuMzg2NjM5IDI0My4wMjIwNTYsMTk4LjgyMjkzNyAyNDUuODU2Mzc1LDIwMS4wNzM3NTUgQzI1MC4zODYyMjQsMjA0LjY4NDExOSAyNTQuMDIyMTc0LDIwOS41MjMxMSAyNTUuODkwNDQ5LDIxNS4wNjUwMDUgQzI1OC4yMjE0ODIsMjIxLjgzODQzMSAyNTcuNzkzMjE2LDIyOS41MjM4ODkgMjU0LjczMjExOSwyMzUuOTkyMzM3IEMyNTAuODExNjE2LDI0NC4zODY1MDYgMjQyLjk3OTIzMiwyNTAuNTQ0MTY2IDIzNC4yNTI5NSwyNTMuMTY0MDc2IEMyMjYuODExNDY3LDI1NS40NjczOSAyMTguNjcxNTM2LDI1NS4zNDUzOTkgMjExLjI3ODkxNSwyNTIuOTA4NDc1IEMyMDQuMjcxNDQ3LDI1MC41NzMyMTIgMTk3Ljg5NjMxNywyNDYuMDM2Mjk0IDE5My43ODAzNjQsMjM5LjgwMDIxMSBDMTkwLjk3Nzk1MSwyMzUuNjI5MjY3IDE4OS4zNTY4NjMsMjMwLjcwMDIzNCAxODguOTcxNzExLDIyNS42ODY5NjkgQzE4OC45NzQ1ODUsMTY5LjQ2MzQ2MyAxODguOTg4OTU3LDExMy4yMzcwNTIgMTg4Ljk2NTk2Myw1Ny4wMTA2NDExIEMxMzguNjE0NTEyLDY4Ljc1Mzc2NDMgODguMjQ1ODE2OCw4MC40MTU1NTk5IDM3Ljg5MTQ5MjUsOTIuMTM4MzUxMiBDMzIuMzkzMDE1Myw5My40MzA4NzkgMjYuODc3MjkyNSw5NC42NDIwNzkyIDIxLjM5NjA2MDksOTYuMDEwMTI1NSBDMjEuNDEzMzA2NSwxNDIuODgzODYzIDIxLjM5MzE4NjYsMTg5Ljc1NDY5NyAyMS40MDc1NTc5LDIzNi42MjU1MyBDMzEuOTQxNzU1LDIzMi44NjcwMzMgNDQuMTY2MDIyNCwyMzMuOTE4NDgzIDUzLjcwNTcyMjMsMjM5Ljg5MzE1NiBDNTguMjQ5OTQyMSwyNDIuNzIyMTk1IDYyLjE1NjA3NDIsMjQ2LjY1MjA2IDY0Ljc5MTc3OTEsMjUxLjM1NDUzOCBDNjcuMTAyNjkxNywyNTUuNDU4Njc2IDY4LjM2NzM3MDIsMjYwLjE1NTM0NSA2OC40MzM0Nzg0LDI2NC44NzUyNSBDNjguNDYyMjIxMSwyNjkuODYyMzc0IDY3LjE0ODY4LDI3NC44NDY1OTMgNjQuNjY4MTg1NSwyNzkuMTYyNzY0IEM2MC41NjM3Mjg5LDI4Ni4zNDU3MzMgNTMuNTQ0NzYzMywyOTEuNjA4NzkgNDUuNzYxMjQxOSwyOTQuMDc3NjY0IEMzNS45MDgyNDY3LDI5Ny4yNTIzNDQgMjQuNzM1OTYxOCwyOTYuMjE4MzIyIDE1LjczMzc1MDMsMjkxLjAxMzM1NiBDOC4wNjUxOTk3MywyODYuNjUwNzEyIDIuMDMyMTA4NDEsMjc5LjAyMzM0NiAwLjQ3MTM4MDE2OSwyNzAuMTcwMjU3IEMwLjM1NjQwOTM5NiwyNjkuMDgxMDQ4IDAuMDg2MjI4MDc5NywyNjguMDE1MDc1IDAuMDA1NzQ4NTM4NjUsMjY2LjkyNTg2NyBDMC4wMDU3NDg1Mzg2NSwxOTQuMjM2NDI4IDAuMDE0MzcxMzQ2NiwxMjEuNTQ2OTg5IDAsNDguODU3NTUwMiBDNjUuNjg4NTUxMiwzMy42MDg2MjY5IDEzMS4zNzEzNTQsMTguMzMwNjU4MSAxOTcuMDU5OTA1LDMuMDczMDIxMTEgQzIwMS41MjM2NDUsMi4wNTY0MjYyMiAyMDUuOTcwMTQsMC45NTI2OTQ2MzUgMjEwLjQ0ODI1MSwwIFoiIGlkPSJTaGFwZSIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPjwvZz48L2c+PC9zdmc+',
play = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xNC4wNzQ1ODM0LDIuOTQ4MDc4NyBMMjUuMTQxNDkyLDIwLjk5NDAyOSBMMy4wMDc2NzUwMywyMC45OTQwMjkgTDE0LjA3NDU4MzQsMi45NDgwNzg3IEwxNC4wNzQ1ODM0LDIuOTQ4MDc4NyBaIiBpZD0iUGxheSIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iI0RERCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuMDA3Njc1LCAxMS45NDgwNzkpIHJvdGF0ZSg5MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDA3Njc1LCAtMTEuOTQ4MDc5KSAiPjwvcGF0aD48L2c+PC9zdmc+",
pause = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjIgMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPjxwYXRoIGQ9Ik0xLDEgTDEsMjUgTDgsMjUgTDgsMSBMMSwxIEwxLDEgWiBNMTQsMSBMMTQsMjUgTDIxLDI1IEwyMSwxIEwxNCwxIEwxNCwxIFoiIGlkPSJTdG9wIiBzdHJva2U9IiNEREQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSIjREREIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+PC9nPjwvc3ZnPg==",
magicStyle = 'hr{border-style:none none solid!important;border-color:rgba(0,0,0,.3)!important;box-shadow:0 1px 0 #fff!important;}img[src="#transparent"]{opacity:0}\
.abbrev{clear:both}.doubledash{visibility:hidden}.deleted,.t-sec{opacity:.6}.inactive{opacity:.4}.reflinks{line-height:2em;font-size:12px;clear:both}\
.highlight,.reply{padding:2px;padding-right:1em;box-shadow:inset 0 1px 30px -9px #fff,0 2px 2px rgba(0,0,0,.2),2px 0 3px -1px rgba(0,0,0,.1)!important;}\
.popup,#magic-panel{box-shadow:5px 5px 10px rgba(0,0,0,.4),inset 0 0 30px rgba(0,0,0,.1)!important;z-index:9;}.cpop{margin-left:4px;background-image:url(/src/svg/1411/closepopup.svg)}.cpop.all{background-image:url(/src/svg/1411/closeallpopups.svg)}.dpop{float:right;width:20px;height:20px;background-image:url('+cmove+');cursor:move}\
.reply,.post-error,.popup,.reply.de-pview{border:0 none transparent!important;}.reply,.reply #reply-trsage,.reply .abbrev{animation:pview .3s normal;-webkit-animation:pview .3s normal}.popup{animation:pview .2s linear;-webkit-animation:pview .2s linear}\
#reply-captcha-image,#yuki-captcha-image,.banner,.spoiler,.spoiler a,.spoiler blockquote,.spoiler blockquote blockquote,.spoiler blockquote blockquote blockquote{transition:all .1s ease;box-shadow:0 1px 2px -1px rgba(0,0,0,.7)!important;}\
.spoiler a:hover,.spoiler:hover,.transparent{box-shadow:none!important;}input[name="captcha"]{width:295px}.url-image{padding-bottom:3px;font-size:12px} .url-image a img{padding:0 1px;}\
.search_google{background-image:url(/src/png/1407/google_14_icon.png)!important} .search_derpibooru{background-image:url(/src/png/1407/derpibooru_reverse_search_14_icon.png)}\
.error-msg,.theader,.passvalid,input[type="text"],input[type="password"],input[type="number"],textarea,.document-container{box-shadow:inset 0 1px 2px rgba(0,0,0,.3)!important;-webkit-border-radius:5px;border-style:none!important;}\
input[type="text"],input[type="number"],input[type="password"],textarea{-webkit-border-radius:3px!important;padding:3px 4px!important;}a.reply_.icon{background-image:url('+rp_arr+')}\
.thumb,.yukiFile,.sc-container,.bc-container,.prosto-pleer,.audio-container video{box-shadow:1px 2px 2px -1px rgba(0,0,0,.4),-1px 0 4px -1px rgba(0,0,0,.2),inset 0 0 30px rgba(0,0,0,.1)!important;}\
#replyform{margin:2px 1em!important;}#magic-bottom{z-index:9;position:fixed;right:1em;bottom:1em;opacity:.2;filter:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'.3 .3 .3 0 0 .3 .3 .3 0 0 .3 .3 .3 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");-webkit-filter:grayscale(100%)}#magic-bottom:hover,#magic-bottom.active{opacity:1;filter:none;-webkit-filter: grayscale(0%)}#magic-panel{position:fixed;right:5px;bottom:5px;max-width: 450px;height:300px;border-radius:8px;padding:9px;padding-bottom:3em;background-color:#fefefe}\
.postcontent{display:inline-block;margin:5px 10px;}.sc-container,.bc-container,.img-container{display:inline-block;float:left}\
.video-container{margin:0 9px;display:inline-block!important;background-color:#000;box-shadow:0 0 2px rgba(0,0,0,.2),0 0 4px rgba(0,0,0,.4),0 9px 9px -8px rgba(0,0,0,.8)!important;}\
a.reply_.icon,.wmark-buttons-panel a.icon img,#trsage a.icon img,input[name="sage"],input[name="subject"],.submit-button{vertical-align:middle}\
.submit-button span{display:none}.submit-button.process{font-size:13px;font-style:italic;color:#777}.submit-button.process span{display:inline}\
.process:after{content:"....";display:inline-block;overflow:hidden;animation:process 3s linear .1s infinite;-webkit-animation:process 3s linear .1s infinite}\
.wmark-button{color:#fff;text-shadow:0 1px 1px rgba(0,0,0,.4);font-size:16px;vertical-align:middle;text-decoration:none;border:none}.wmark-button.spoiler{font-size:15px;text-shadow:none;color:transparent}\
.post-count,.allowed-posts,.reply-from{font-variant:small-caps;font-weight:bold;color:transparent!important;text-shadow:0 1px 1px rgba(255,255,255,.8),-1px 0 0 #666;}.allowed-posts a{text-decoration:none;text-shadow:none;font-weight:normal}.ta-inact::-moz-selection{background:rgba(99,99,99,.3);}.ta-inact::selection{background:rgba(99,99,99,.3)}\
pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}\
.yuki_clickable{cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:-moz-none;-ms-user-select:none;user-select:none}\
.yukiFile{text-align:center;font-size:66%;display:inline-block;width:210px;background:#fefefe;-webkit-border-radius:5px;margin:5px;padding:2px}\
#files_placeholder > *{vertical-align:top}#magic-panel tr{height:3em}.s-sect{text-align:left;padding-left:2em;color:#777}#vsize-textbox{color:#bbb;font-family:Trebuchet}\
.yukiFile img{max-width:150px;box-shadow:0 4px 8px 0 rgba(0,0,0,.2);margin:5px 0}.yukiFile span{max-width:200px;word-wrap:break-word}\
.rating_SFW{background:green}.rating_R15{background:yellow}.rating_R18{background:orange}.rating_R18G{background:red}\
input[type="text"],input[type="password"],textarea{padding:4px!important} #int-upd{bottom:2px;position:relative}.content-frame.pdf{top:1%;left:17%;right:20%;bottom:1%}\
.sagearrow{position:relative;right:25px;top:6px}#int-stat{font-size:14px;margin:0}#yukipostform{display:inline-block;text-align:left;padding:4px 8px}.topformtr #yukipostform #close-form{visibility:hidden}#hideinfodiv{margin:9px}#new-thread-create{position:absolute;cursor:pointer;left:23px;font-size:18px}.selected:before{content:"✓ ";color:green}\
.hidup{top:-9999px!important}.hidout,.add_,.play_,.view_,.edit_[href^="/utils/text/"],#postform,.reply #new-thread-create,.submit-button.process input{display:none!important}.content-frame{background-color:#fefefe}.content-frame.video{background-color:#000}.content-frame.img{background-color:transparent}\
.content-window{position:fixed;left:0;top:0;z-index:2999}.content-frame{position:absolute;top:10%;left:12%;right:18%;bottom:20%;box-shadow:5px 5px 10px rgba(0,0,0,.4);z-index:3000}\
#shadow-box{position:absolute;background-color:rgba(33,33,33,.8);z-index:2999}.artwork{background:url('+artwork+')no-repeat scroll center center / 100% auto}\
#close-content-window,#show-content-window{transition:.5s ease;opacity:.6;width:29px;height:29px;background-image:url(/src/png/1411/close-29x29.png);cursor:pointer;position:absolute;top:20px;right:20px;z-index:3000}\
#show-content-window{right:52%;position:fixed;background-image:url(/src/png/1501/show-hidden-29x29.png);border-radius:100%}#close-content-window:hover,#show-content-window:hover{opacity:1}\
.document-container,.content-frame.document,.document-container > iframe{overflow:auto;resize:both;background-color:#fefefe;} .document-container > iframe, .content-frame.document > iframe, .full-size, #shadow-box, .content-window,.preview_img{width:100%;height:100%}.ma-play{background:url('+play+')no-repeat scroll center} .ma-pause{background:url('+pause+')no-repeat scroll center}\
.magic-audio{width:200px;height:200px} .ma-controls,.ma-controls a{display:block;width:50px;height:50px}.magic-info{width:190px;background-color:rgba(255,255,255,.8);position:absolute;padding:5px;opacity:.6}.magic-info:hover{z-index:1;opacity:1}\
.ma-controls{position:relative;top:37%;left:37%;border:2px solid #ddd;border-radius:100%;background-color:#333;opacity:.8}.yukiFile.artwork{}\
#yukidropBox{width:7em;height:18em;display:inline-block;border:3px dashed rgba(99,99,99,.3);padding:2px}\
#yukidropBox tr,.f-sect,.hideinfo{text-align:center!important} .droparrow{background:url(/src/svg/1409/DropArrow.svg)no-repeat center;display:block;padding:9em 3em}\
@keyframes pview{0%{transform:scale(0,0);opacity:0} 25%{transform:scale(.3,.3);opacity:.1} 50%{transform:scale(.9,.9);opacity:.3} 75%{transform:scale(1.02,1.02);opacity:.7} 100%{transform:scale(1,1);opacity:1}}\
@-webkit-keyframes pview{0%{-webkit-transform:scale(0,0);opacity:0} 25%{-webkit-transform:scale(.3,.3);opacity:.1} 50%{-webkit-transform:scale(.9,.9);opacity:.3} 75%{-webkit-transform:scale(1.02,1.02);opacity:.7} 100%{-webkit-transform:scale(1,1);opacity:1}}\
@keyframes process{0%{width:0}100%{width:1em}}@-webkit-keyframes process{0%{width:0}100%{width:1em}}\
input[type="button"],input[type="submit"]{transition:all .3s ease;box-shadow:0 1px 3px -1px rgba(0,0,0,.5),0 0 2px rgba(0,0,0,.2) inset;padding:2px 6px;color:#999;border:0 none;background-color:#fff}\
input[type="button"]:hover,input[type="submit"]:hover{background-color:rgba(255,255,255,.5)}input[type="button"]:active,input[type="submit"]:active{box-shadow:0 0 2px rgba(255,255,255,.3),0 0 2px rgba(0,0,0,.2) inset;background-color:rgba(255,255,255,.2)}\
.checkarea{box-shadow:inset 1px 1px 2px rgba(0,0,0,.3),0 0 2px #fff;border-radius:3px;padding:0 4px;background-color:#fff;font-size:14px}.checkarea:before{content:"✗";color:transparent}input[type="checkbox"]:checked + .checkarea:before{color:grey}',
blobView = '\nvar BlobView=function(){function e(e){throw Error(e)}function t(e,t,n,r,i,s,o){this.blob=e;this.sliceOffset=t;this.sliceLength=n;this.slice=r;this.viewOffset=i;this.viewLength=s;this.littleEndian=o;this.view=new DataView(r,i,s);this.buffer=r;this.byteLength=s;this.byteOffset=i;this.index=0}t.get=function(n,r,i,s,o){if(r<0){e("negative offset")}if(i<0){e("negative length")}if(r>n.size){e("offset larger than blob size")}if(r+i>n.size){i=n.size-r}var u=n.slice(r,r+i);var a=new FileReader;a.readAsArrayBuffer(u);a.onloadend=function(){var e=null;if(a.result){e=new t(n,r,i,a.result,0,i,o||false)}s(e,a.error)}};t.prototype={constructor:t,getMore:function(e,n,r){if(e>=this.sliceOffset&&e+n<=this.sliceOffset+this.sliceLength){r(new t(this.blob,this.sliceOffset,this.sliceLength,this.slice,e-this.sliceOffset,n,this.littleEndian))}else{t.get(this.blob,e,n,r,this.littleEndian)}},littleEndian:function(){this.littleEndian=true},bigEndian:function(){this.littleEndian=false},getUint8:function(e){return this.view.getUint8(e)},getInt8:function(e){return this.view.getInt8(e)},getUint16:function(e,t){return this.view.getUint16(e,t!==undefined?t:this.littleEndian)},getInt16:function(e,t){return this.view.getInt16(e,t!==undefined?t:this.littleEndian)},getUint32:function(e,t){return this.view.getUint32(e,t!==undefined?t:this.littleEndian)},getInt32:function(e,t){return this.view.getInt32(e,t!==undefined?t:this.littleEndian)},getFloat32:function(e,t){return this.view.getFloat32(e,t!==undefined?t:this.littleEndian)},getFloat64:function(e,t){return this.view.getFloat64(e,t!==undefined?t:this.littleEndian)},readByte:function(){return this.view.getInt8(this.index++)},readUnsignedByte:function(){return this.view.getUint8(this.index++)},readShort:function(e){var t=this.view.getInt16(this.index,e!==undefined?e:this.littleEndian);this.index+=2;return t},readUnsignedShort:function(e){var t=this.view.getUint16(this.index,e!==undefined?e:this.littleEndian);this.index+=2;return t},readInt:function(e){var t=this.view.getInt32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readUnsignedInt:function(e){var t=this.view.getUint32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readFloat:function(e){var t=this.view.getFloat32(this.index,e!==undefined?e:this.littleEndian);this.index+=4;return t},readDouble:function(e){var t=this.view.getFloat64(this.index,e!==undefined?e:this.littleEndian);this.index+=8;return t},tell:function(){return this.index},remaining:function(){return this.byteLength-this.index},seek:function(t){if(t<0){e("negative index")}if(t>this.byteLength){e("index greater than buffer size")}this.index=t},advance:function(t){var n=this.index+t;if(n<0){e("advance past beginning of buffer")}if(n>this.byteLength){e("advance past end of buffer")}this.index=n},getUnsignedByteArray:function(e,t){return new Uint8Array(this.buffer,e+this.viewOffset,t)},readUnsignedByteArray:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e);this.index+=e;return t},getBit:function(e,t){var n=this.view.getUint8(e);return(n&1<<t)!==0},getUint24:function(e,t){var n,r,i;if(t!==undefined?t:this.littleEndian){n=this.view.getUint8(e);r=this.view.getUint8(e+1);i=this.view.getUint8(e+2)}else{i=this.view.getUint8(e);r=this.view.getUint8(e+1);n=this.view.getUint8(e+2)}return(i<<16)+(r<<8)+n},readUint24:function(e){var t=this.getUint24(this.index,e);this.index+=3;return t},getASCIIText:function(e,t){var n=new Uint8Array(this.buffer,e+this.viewOffset,t);return String.fromCharCode.apply(String,n)},readASCIIText:function(e){var t=new Uint8Array(this.buffer,this.index+this.viewOffset,e);this.index+=e;return String.fromCharCode.apply(String,t)},getUTF8Text:function(e,t){function n(){throw new Error("Illegal UTF-8")}var r=e;var i=e+t;var s;var o="";var u,a,f,l;while(r<i){var u=this.view.getUint8(r);if(u<128){o+=String.fromCharCode(u);r+=1}else if(u<194){n()}else if(u<224){if(r+1>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}s=((u&31)<<6)+(a&63);o+=String.fromCharCode(s);r+=2}else if(u<240){if(r+2>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}f=this.view.getUint8(r+2);if(f<128||f>191){n()}s=((u&15)<<12)+((a&63)<<6)+(f&63);o+=String.fromCharCode(s);r+=3}else if(u<245){if(r+3>=i){n()}a=this.view.getUint8(r+1);if(a<128||a>191){n()}f=this.view.getUint8(r+2);if(f<128||f>191){n()}l=this.view.getUint8(r+3);if(l<128||l>191){n()}s=((u&7)<<18)+((a&63)<<12)+((f&63)<<6)+(l&63);s-=65536;o+=String.fromCharCode(55296+((s&1047552)>>>10));o+=String.fromCharCode(56320+(s&1023));r+=4}else{n()}}return o},readUTF8Text:function(e){try{return this.getUTF8Text(this.index,e)}finally{this.index+=e}},getID3Uint28BE:function(e){var t=this.view.getUint8(e)&127;var n=this.view.getUint8(e+1)&127;var r=this.view.getUint8(e+2)&127;var i=this.view.getUint8(e+3)&127;return t<<21|n<<14|r<<7|i},readID3Uint28BE:function(){var e=this.getID3Uint28BE(this.index);this.index+=4;return e},readNullTerminatedLatin1Text:function(e){var t="";var n=unescape("%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+"%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+"%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+"%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457");var r=function(e){if(e>=192&&e<=255)return String.fromCharCode(e-192+1040);if(e>=128&&e<=191)return n.charAt(e-128);return String.fromCharCode(e)};for(var i=0;i<e;i++){var s=this.view.getUint8(this.index+i);if(s===0){i++;break}t+=r(s)}this.index+=i;return t},readNullTerminatedUTF8Text:function(e){for(var t=0;t<e;t++){if(this.view.getUint8(this.index+t)===0){break}}var n=this.readUTF8Text(t);if(t<e){this.advance(1)}return n},readNullTerminatedUTF16Text:function(e,t){if(t==null){var n=this.readUnsignedShort();e-=2;if(n===65279){t=false}else{t=true}}var r="";for(var i=0;i<e;i+=2){var s=this.getUint16(this.index+i,t);if(s===0){i+=2;break}r+=String.fromCharCode(s)}this.index+=i;return r}};return{get:t.get}}()';

function parse_audio_metadata(blob,metadataCallback,errorCallback){var filename=blob.name;errorCallback=errorCallback||function(e){console.warn(e);};if(filename){if(filename.slice(0,5)==='DCIM/'&&filename.slice(-4).toLowerCase()==='.3gp'){errorCallback('skipping 3gp video file');return;}
if(filename.slice(-4).toLowerCase()==='.m4v'){errorCallback('skipping m4v video file');return;}}
if(blob.size<128){errorCallback('file is empty or too small');return;}
var TITLE='title';var ARTIST='artist';var ALBUM='album';var TRACKNUM='tracknum';var IMAGE='picture';var YEAR='year';var GENRE='genre';var genres_list=['Blues','Classic Rock','Country','Dance','Disco','Funk','Grunge','Hip-Hop','Jazz','Metal','New Age','Oldies','Other','Pop','R&B','Rap','Reggae','Rock','Techno','Industrial','Alternative','Ska','Death Metal','Pranks','Soundtrack','Euro-Techno','Ambient','Trip-Hop','Vocal','Jazz+Funk','Fusion','Trance','Classical','Instrumental','Acid','House','Game','Sound Clip','Gospel','Noise','AlternRock','Bass','Soul','Punk','Space','Meditative','Instrumental Pop','Instrumental Rock','Ethnic','Gothic','Darkwave','Techno-Industrial','Electronic','Pop-Folk','Eurodance','Dream','Southern Rock','Comedy','Cult','Gangsta Rap','Top 40','Christian Rap','Pop / Funk','Jungle','Native American','Cabaret','New Wave','Psychedelic','Rave','Showtunes','Trailer','Lo-Fi','Tribal','Acid Punk','Acid Jazz','Polka','Retro','Musical','Rock & Roll','Hard Rock','Folk','Folk-Rock','National Folk','Swing','Fast Fusion','Bebob','Latin','Revival','Celtic','Bluegrass','Avantgarde','Gothic Rock','Progressive Rock','Psychedelic Rock','Symphonic Rock','Slow Rock','Big Band','Chorus','Easy Listening','Acoustic','Humour','Speech','Chanson','Opera','Chamber Music','Sonata','Symphony','Booty Bass','Primus','Porn Groove','Satire','Slow Jam','Club','Tango','Samba','Folklore','Ballad','Power Ballad','Rhythmic Soul','Freestyle','Duet','Punk Rock','Drum Solo','A Cappella','Euro-House','Dance Hall','Goa','Drum & Bass','Club-House','Hardcore','Terror','Indie','BritPop','Negerpunk','Polsk Punk','Beat','Christian Gangsta Rap','Heavy Metal','Black Metal','Crossover','Contemporary Christian','Christian Rock','Merengue','Salsa','Thrash Metal','Anime','JPop','Synthpop','Abstract','Art Rock','Baroque','Bhangra','Big Beat','Breakbeat','Chillout','Downtempo','Dub','EBM','Eclectic','Electro','Electroclash','Emo','Experimental','Garage','Global','IDM','Illbient','Industro-Goth','Jam Band','Krautrock','Leftfield','Lounge','Math Rock','New Romantic','Nu-Breakz','Post-Punk','Post-Rock','Psytrance','Shoegaze','Space Rock','Trop Rock','World Music','Neoclassical','Audiobook','Audio Theatre','Neue Deutsche Welle','Podcast','Indie Rock','G-Funk','Dubstep','Garage Rock','Psybient']
var RATED='rated';var PLAYED='played';var ID3V2TAGS={TIT2:TITLE,TT2:TITLE,TPE1:ARTIST,TP1:ARTIST,TALB:ALBUM,TAL:ALBUM,TRCK:TRACKNUM,TRK:TRACKNUM,APIC:IMAGE,PIC:IMAGE,POPM:RATED,POP:RATED,PCNT:PLAYED,CNT:PLAYED,TORY:YEAR,TDOR:YEAR,TYER:YEAR,TYE:YEAR,TDRC:YEAR,TCON:GENRE,TCO:GENRE};var OGGTAGS={title:TITLE,artist:ARTIST,album:ALBUM,tracknumber:TRACKNUM};var MP4TAGS={'\xa9alb':ALBUM,'\xa9art':ARTIST,'\xa9ART':ARTIST,'aART':ARTIST,'\xa9nam':TITLE,'trkn':TRACKNUM,'covr':IMAGE,'Year':YEAR};var MP4Types={'M4A ':true,'M4B ':true,'mp41':true,'mp42':true,'isom':true,'iso2':true};var MP4Codecs={'mp4a':true,'samr':true,'sawb':true,'sawp':true,'alac':true};var metadata={};metadata[ARTIST]=metadata[ALBUM]=metadata[TITLE]=metadata[YEAR]='';metadata[RATED]=metadata[PLAYED]=0;if(filename){var p1=filename.lastIndexOf('/');var p2=filename.lastIndexOf('.');if(p2===-1){p2=filename.length;}
metadata[TITLE]=filename.substring(p1+1,p2);}
var headersize=Math.min(64*1024,blob.size);BlobView.get(blob,0,headersize,function(header,error){if(error){errorCallback(error);return;}
try{var magic=header.getASCIIText(0,12);if(magic.substring(0,9)==='LOCKED 1 '){handleLockedFile(blob);return;}
if(magic.substring(0,3)==='ID3'){parseID3v2Metadata(header);}else if(magic.substring(0,4)==='OggS'){parseOggMetadata(header);}else if(magic.substring(4,8)==='ftyp'){if(checkMP4Type(header,MP4Types)){parseMP4Metadata(header);return;}
else{errorCallback('Unknown MP4 file type');}}else if((header.getUint16(0,false)&0xFFFE)===0xFFFA){BlobView.get(blob,blob.size-128,128,function(footer,error){if(error){errorCallback(error);return;}
try{var magic=footer.getASCIIText(0,3);if(magic==='TAG'){parseID3v1Metadata(footer);}else{metadataCallback(metadata);}}
catch(e){errorCallback(e);}});}else{errorCallback('Unplayable music file');}}
catch(e){console.error('parseAudioMetadata:',e,e.stack);errorCallback(e);}});function parseID3v1Metadata(footer){var title=footer.getASCIIText(3,30);var artist=footer.getASCIIText(33,30);var album=footer.getASCIIText(63,30);var p=title.indexOf('\0');if(p!==-1){title=title.substring(0,p);}
p=artist.indexOf('\0');if(p!==-1){artist=artist.substring(0,p);}
p=album.indexOf('\0');if(p!==-1){album=album.substring(0,p);}
metadata[TITLE]=title||undefined;metadata[ARTIST]=artist||undefined;metadata[ALBUM]=album||undefined;var b1=footer.getUint8(125);var b2=footer.getUint8(126);if(b1===0&&b2!==0){metadata[TRACKNUM]=b2;}
metadataCallback(metadata);}
function parseID3v2Metadata(header){header.index=3;var id3version=header.readUnsignedByte();if(id3version>4){console.warn('mp3 file with unknown metadata version');metadataCallback(metadata);return;}
var id3revision=header.readUnsignedByte();var id3flags=header.readUnsignedByte();var has_extended_header=((id3flags&0x40)!==0);var length=header.readID3Uint28BE();header.getMore(header.index,length,parseID3);function parseID3(id3){if(has_extended_header){id3.advance(id3.readUnsignedInt());}
while(id3.index<id3.byteLength){var tagid,tagsize,tagflags;if(id3.getUint8(id3.index)===0){break;}
switch(id3version){case 2:tagid=id3.readASCIIText(3);tagsize=id3.readUint24();tagflags=0;break;case 3:tagid=id3.readASCIIText(4);tagsize=id3.readUnsignedInt();tagflags=id3.readUnsignedShort();break;case 4:tagid=id3.readASCIIText(4);tagsize=id3.readID3Uint28BE();tagflags=id3.readUnsignedShort();break;}
var nexttag=id3.index+tagsize;var tagname=ID3V2TAGS[tagid];if(!tagname){id3.index=nexttag;continue;}
if((tagflags&0xFF)!==0){console.warn('Skipping',tagid,'tag with flags',tagflags);id3.index=nexttag;continue;}
try{var tagvalue=null;switch(tagid){case'TIT2':case'TT2':case'TPE1':case'TP1':case'TALB':case'TAL':case'TORY':case'TDOR':case'TYER':case'TYE':case'TDRC':tagvalue=readText(id3,tagsize);break;case'TRCK':case'TRK':case'PCNT':case'CNT':tagvalue=parseInt(readText(id3,tagsize));break;case'APIC':case'PIC':tagvalue=readPic(id3,tagsize,tagid);break;case'TCON':case'TCO':tagvalue=readText(id3,tagsize)||'';tagvalue=new String(tagvalue).replace(/^\(?([0-9]+)\)?$/,function(match,genre_index){return genres_list[parseInt(genre_index)]});break;case'POPM':case'POP':tagvalue=readText(id3,tagsize,0);if(isNaN(parseInt(tagvalue))){tagvalue=id3.readUnsignedByte();}
if(tagvalue==0){tagvalue=0;}else if(tagvalue<64){tagvalue=1;}else if(tagvalue<128){tagvalue=2;}else if(tagvalue<192){tagvalue=3;}else if(tagvalue<255){tagvalue=4;}else{tagvalue=5;}}
if(tagvalue){metadata[tagname]=tagvalue;}}
catch(e){console.warn('Error parsing mp3 metadata tag',tagid,':',e);}
id3.index=nexttag;}
metadataCallback(metadata);}
function readPic(view,size,id){var start=view.index;var encoding=view.readUnsignedByte();var mimetype;if(id==='PIC'){mimetype=view.readASCIIText(3);if(mimetype==='JPG'){mimetype='image/jpeg';}
else if(mimetype==='PNG'){mimetype='image/png';}}
else{mimetype=view.readNullTerminatedLatin1Text(size-1);}
var kind=view.readUnsignedByte();var desc=readText(view,size-(view.index-start),encoding);var picstart=view.sliceOffset+view.viewOffset+view.index;var piclength=size-(view.index-start);return blob.slice(picstart,picstart+piclength,mimetype);}
function readText(view,size,encoding){if(encoding===undefined){encoding=view.readUnsignedByte();size=size-1;}
switch(encoding){case 0:return view.readNullTerminatedLatin1Text(size);case 1:return view.readNullTerminatedUTF16Text(size,undefined);case 2:return view.readNullTerminatedUTF16Text(size,false);case 3:return view.readNullTerminatedUTF8Text(size);default:throw Error('unknown text encoding');}}}
function parseOggMetadata(header){function sum(x,y){return x+y;}
var p1_num_segments=header.getUint8(26);var p1_segment_lengths=header.getUnsignedByteArray(27,p1_num_segments);var p1_length=Array.reduce(p1_segment_lengths,sum,0);var p2_header=27+p1_num_segments+p1_length;var p2_num_segments=header.getUint8(p2_header+26);var p2_segment_lengths=header.getUnsignedByteArray(p2_header+27,p2_num_segments);var p2_length=Array.reduce(p2_segment_lengths,sum,0);var p2_offset=p2_header+27+p2_num_segments;header.getMore(p2_offset,p2_length,function(page,error){if(error){errorCallback(error);return;}
var first_byte=page.readByte();var valid=false;switch(first_byte){case 3:valid=page.readASCIIText(6)==='vorbis';break;case 79:valid=page.readASCIIText(7)==='pusTags';break;}
if(!valid){errorCallback('malformed ogg comment packet');return;}
var vendor_string_length=page.readUnsignedInt(true);page.advance(vendor_string_length);var num_comments=page.readUnsignedInt(true);var seen_fields={};for(var i=0;i<num_comments;i++){if(page.remaining()<4){break;}
var comment_length=page.readUnsignedInt(true);if(comment_length>page.remaining()){break;}
var comment=page.readUTF8Text(comment_length);var equal=comment.indexOf('=');if(equal!==-1){var tag=comment.substring(0,equal).toLowerCase().replace(' ','');var propname=OGGTAGS[tag];if(propname){var value=comment.substring(equal+1);if(seen_fields.hasOwnProperty(propname)){metadata[propname]+=' '+value;}
else{metadata[propname]=value;seen_fields[propname]=true;}}}}});metadataCallback(metadata);}
function checkMP4Type(header,types){var majorbrand=header.getASCIIText(8,4);if(majorbrand in types){return true;}
else{var index=16;var size=header.getUint32(0);while(index<size){var compatiblebrand=header.getASCIIText(index,4);index+=4;if(compatiblebrand in types){return true;}}
return false;}}
function parseMP4Metadata(header){findMoovAtom(header);function findMoovAtom(atom){try{var offset=atom.sliceOffset+atom.viewOffset;var size=atom.readUnsignedInt();var type=atom.readASCIIText(4);if(size===0){size=atom.blob.size-offset;}
else if(size===1){size=atom.readUnsignedInt()*4294967296+atom.readUnsignedInt();}
if(type==='moov'){atom.getMore(offset,size,function(moov){try{parseMoovAtom(moov,size);metadataCallback(metadata);}
catch(e){errorCallback(e);}});}
else{if(offset+size+16<=atom.blob.size){atom.getMore(offset+size,16,findMoovAtom);}
else{metadataCallback(metadata);}}}
catch(e){errorCallback(e);}}
function parseMoovAtom(data,end){data.advance(8);while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);var nextindex=data.index+size-8;if(type==='udta'){parseUdtaAtom(data,end);data.index=nextindex;}
else if(type==='trak'){data.advance(-8);var mdia=findChildAtom(data,'mdia');if(mdia){var minf=findChildAtom(mdia,'minf');if(minf){var vmhd=searchChildAtom(minf,'vmhd');if(vmhd){}
var smhd=searchChildAtom(minf,'smhd');if(smhd){var stbl=findChildAtom(minf,'stbl');if(stbl){var stsd=findChildAtom(stbl,'stsd');if(stsd){stsd.advance(20);var codec=stsd.readASCIIText(4);if(!(codec in MP4Codecs)){throw'Unsupported format in MP4 container: '+codec;}}}}}}
data.index=nextindex;}
else{data.advance(size-8);}}}
function findChildAtom(data,atom){var start=data.index;var length=data.readUnsignedInt();data.advance(4);while(data.index<start+length){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type===atom){data.advance(-8);return data;}
else{data.advance(size-8);}}
return null;}
function searchChildAtom(data,atom){var start=data.index;var target=findChildAtom(data,atom);data.index=start;return target;}
function parseUdtaAtom(data,end){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type==='meta'){parseMetaAtom(data,data.index+size-8);data.index=end;return;}
else{data.advance(size-8);}}}
function parseMetaAtom(data,end){data.advance(4);while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type==='ilst'){parseIlstAtom(data,data.index+size-8);data.index=end;return;}
else{data.advance(size-8);}}}
function parseIlstAtom(data,end){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);var next=data.index+size-8;var tagname=MP4TAGS[type];if(tagname){try{var value=getMetadataValue(data,next,type);metadata[tagname]=value;}
catch(e){console.warn('skipping',type,':',e);}}
data.index=next;}}
function getMetadataValue(data,end,tagtype){while(data.index<end){var size=data.readUnsignedInt();var type=data.readASCIIText(4);if(type!=='data'){data.advance(size-8);continue;}
var datatype=data.readUnsignedInt()&0xFFFFFF;data.advance(4);var datasize=size-16;if(tagtype==='trkn'){data.advance(2);return data.readUnsignedShort();}
switch(datatype){case 1:return data.readUTF8Text(datasize);case 13:return blob.slice(data.sliceOffset+data.viewOffset+data.index,data.sliceOffset+data.viewOffset+data.index+datasize,'image/jpeg');case 14:return blob.slice(data.sliceOffset+data.viewOffset+data.index,data.sliceOffset+data.viewOffset+data.index+datasize,'image/png');default:throw Error('unexpected type in data atom');}}
throw Error('no data atom found');}}
function handleLockedFile(locked){ForwardLock.getKey(function(secret){ForwardLock.unlockBlob(secret,locked,callback,errorCallback);function callback(unlocked,unlockedMetadata){parseAudioMetadata(unlocked,function(metadata){metadata.locked=true;if(unlockedMetadata.vendor){metadata.vendor=unlockedMetadata.vendor;}
if(!metadata[TITLE]){metadata[TITLE]=unlockedMetadata.name;}
metadataCallback(metadata);},errorCallback);}});}}

/* Tinycon - A small library for manipulating the Favicon Tom Moor, http://tommoor.com */
(function(){var Tinycon={};var currentFavicon=null;var originalFavicon=null;var faviconImage=null;var canvas=null;var options={};var r=window.devicePixelRatio||1;var size=16*r;var defaults={width:7,height:9,font:10*r+'px arial',colour:'#fff',background:'#F03D25',fallback:true,crossOrigin:true,abbreviate:true};var ua=(function(){var agent=navigator.userAgent.toLowerCase();return function(browser){return agent.indexOf(browser)!==-1}}());var browser={ie:ua('msie'),chrome:ua('chrome'),webkit:ua('chrome')||ua('safari'),safari:ua('safari')&&!ua('chrome'),mozilla:ua('mozilla')&&!ua('chrome')&&!ua('safari')};var getFaviconTag=function(){var links=document.getElementsByTagName('link');for(var i=0,len=links.length;i<len;i++){if((links[i].getAttribute('rel')||'').match(/\bicon\b/)){return links[i]}}return false};var removeFaviconTag=function(){var links=document.getElementsByTagName('link');var head=document.getElementsByTagName('head')[0];for(var i=0,len=links.length;i<len;i++){var exists=(typeof(links[i])!=='undefined');if(exists&&(links[i].getAttribute('rel')||'').match(/\bicon\b/)){head.removeChild(links[i])}}};var getCurrentFavicon=function(){if(!originalFavicon||!currentFavicon){var tag=getFaviconTag();originalFavicon=currentFavicon=tag?tag.getAttribute('href'):'/favicon.ico'}return currentFavicon};var getCanvas=function(){if(!canvas){canvas=document.createElement("canvas");canvas.width=size;canvas.height=size}return canvas};var setFaviconTag=function(url){removeFaviconTag();var link=document.createElement('link');link.type='image/x-icon';link.rel='icon';link.href=url;document.getElementsByTagName('head')[0].appendChild(link)};var log=function(message){if(window.console)window.console.log(message)};var drawFavicon=function(label,colour){if(!getCanvas().getContext||browser.ie||browser.safari||options.fallback==='force'){return updateTitle(label)}var context=getCanvas().getContext("2d");var colour=colour||'#000';var src=getCurrentFavicon();faviconImage=document.createElement('img');faviconImage.onload=function(){context.clearRect(0,0,size,size);context.drawImage(faviconImage,0,0,faviconImage.width,faviconImage.height,0,0,size,size);if((label+'').length>0)drawBubble(context,label,colour);refreshFavicon()};if(!src.match(/^data/)&&options.crossOrigin){faviconImage.crossOrigin='anonymous'}faviconImage.src=src};var updateTitle=function(label){if(options.fallback){var originalTitle=document.title;if(originalTitle[0]==='('){originalTitle=originalTitle.slice(originalTitle.indexOf(' '))}if((label+'').length>0){document.title='('+label+') '+originalTitle}else{document.title=originalTitle}}};var drawBubble=function(context,label,colour){if(typeof label=='number'&&label>99&&options.abbreviate){label=abbreviateNumber(label)}var len=(label+'').length-1;var width=options.width*r+(6*r*len),height=options.height*r;var top=size-height,left=size-width-r,bottom=16*r,right=16*r,radius=2*r;context.font=(browser.webkit?'bold ':'')+options.font;context.fillStyle=options.background;context.strokeStyle=options.background;context.lineWidth=r;context.beginPath();context.moveTo(left+radius,top);context.quadraticCurveTo(left,top,left,top+radius);context.lineTo(left,bottom-radius);context.quadraticCurveTo(left,bottom,left+radius,bottom);context.lineTo(right-radius,bottom);context.quadraticCurveTo(right,bottom,right,bottom-radius);context.lineTo(right,top+radius);context.quadraticCurveTo(right,top,right-radius,top);context.closePath();context.fill();context.beginPath();context.strokeStyle="rgba(0,0,0,.3)";context.moveTo(left+radius/2.0,bottom);context.lineTo(right-radius/2.0,bottom);context.stroke();context.fillStyle=options.colour;context.textAlign="right";context.textBaseline="top";context.fillText(label,r===2?29:15,browser.mozilla?7*r:6*r)};var refreshFavicon=function(){if(!getCanvas().getContext)return;setFaviconTag(getCanvas().toDataURL())};var abbreviateNumber=function(label){var metricPrefixes=[['G',1000000000],['M',1000000],['k',1000]];for(var i=0;i<metricPrefixes.length;++i){if(label>=metricPrefixes[i][1]){label=round(label/metricPrefixes[i][1])+metricPrefixes[i][0];break}}return label};var round=function(value,precision){var number=new Number(value);return number.toFixed(precision)};Tinycon.setOptions=function(custom){options={};for(var key in defaults){options[key]=custom.hasOwnProperty(key)?custom[key]:defaults[key]}return this};Tinycon.setImage=function(url){currentFavicon=url;refreshFavicon();return this};Tinycon.setBubble=function(label,colour){label=label||'';drawFavicon(label,colour);return this};Tinycon.reset=function(){setFaviconTag(originalFavicon)};Tinycon.setOptions(defaults);window.Tinycon=Tinycon;if(typeof define==='function'&&define.amd){define(Tinycon)}})();
//Copyright (c) 2012 Tom Moor @license MIT Licensed @version 0.6.3

function $each(obj, Fn) {
	Array.prototype.slice.call(obj, 0).forEach(Fn)
}
function $setup(obj, attr, events) {
	var el = typeof obj == "string" ? document.createElement(obj) : obj;
	if (attr) {
		for (var key in attr) {
			attr[key] === undefined ? el.removeAttribute(key) :
			key === 'html'    ? el.innerHTML   = attr[key] :
			key === 'text'    ? el.textContent = attr[key] :
			key === 'value'   ? el.value       = attr[key] :
			key === 'checked' ? el.checked     = attr[key] :
			el.setAttribute(key, attr[key]);
		}
	}
	if (events) {
		for (var key in events) {
			el.addEventListener(key, events[key], false);
		}
	}
	return el;
}
function $placeNode(p, el, node) {
	var i, To, In = el.parentNode;
	if (p === 'append') {
		for (i = 0, len = node.length; i < len; i++) {
			if (node[i])
				el.appendChild(node[i]);
		}
	} else if (p === 'remove') {
		$each(el, function(node) {
			node.parentNode.removeChild(node);
		});
	} else if (p === 'replace') {
		In.replaceChild(node, el);
	} else {
		if (p === 'after') To = el.nextSibling;
		if (p === 'before') To = el;
		if (p === 'prepend') To = el.childNodes[0], In = el;
		In.insertBefore(node, To);
	}
}

$placeNode('append', document.head, [
	$setup("script", {"src": "/src/js/1501/aurora_0.4.4.js"}, null),
	$setup("script", {"src": "/src/js/1501/flac_0.2.1.js"}, null),
	$setup("script", {"src": "/src/js/1501/alac_0.1.0.js"}, null),
	$setup("script", {"text": blobView +'\n'+ parse_audio_metadata.toString() +'\n'+ $each.toString() +
		'\n'+ $setup.toString() +'\n'+ $placeNode.toString() +'\n('+MagicExtension.toString()+')();'}, null),
	$setup("style", {"text": magicStyle}, null)
]);

function MagicExtension() {
	var thread_updating,
		window_focused = false,
		ru = Hanabira.LC_ru,
		fCont = [0, 0, 0],
		unread_count = 0,
		repliesMap = {},
		fileList = [],
		timer_id = 0,
	HM = {
		MC: ['windowFrame', 'postContent'].indexOf(getlSValue('EmbedIn', 'postContent')),
		zIndex: 0, RefTab: null, Played: null, VActive: [], 
		LastKey: null, TextArea: null, LoadedPosts: {},
		LinksMap: JSON.parse(getlSValue('LinksCache', '{}')),
		AlbumArts: JSON.parse(getlSValue('AlbumArts', '{}')),
		RemoveFileName: getlSValue('RemoveFileName', false),
		UpdateInterval: function() {
			var i = getlSValue('UpdateInterval', 45, true),
				t = i < 5 ? 45 : i;
			return { val: t, int: t * 1000 };
		},
		RemoveExif: getlSValue('RemoveExif', true),
		SoundNotify: getlSValue('SoundNotify', false, true),
		AttachPopups: getlSValue('AttachPopups', true),
		AutoUpdate: getlSValue('AutoUpdate', true, true),
		maXrating: getlSValue('maXrating', 'SFW'),
		oEmbedAPI: getlSValue('oEmbedAPI', true),
		Sage: getlSValue('Sage', false, true),
		Elems: GetElements(),
		URL: ParseUrl(),
		defaultName: function(name) {
			var i, lng = ru ? 'ru' : 'en';
			if (name) {
				i = LC.names['ru'].indexOf(name)
				return (i >= 0 ? LC.names[lng][i] : name)
			} else {
				switch (HM.URL.board) {
					case 's'   : i = 1; break;
					case 'sw'  : i = 2; break;
					case 'wn'  : i = 3; break;
					case 'slow': i = 4; break;
					case 'mad' : i = 5; break;
					default    : i = 0;
				}
				return LC.names[lng][i]
			}
		}},
	Target = {
		board: HM.URL.board,
		tid: HM.URL.thread,
		thread: function(num) {
			return document.getElementById('thread_'+ (num || Target.tid));
		},
		last: function() {
			var tlel = Target.thread().lastElementChild;
			return tlel.nodeName === 'FORM' ? tlel.previousElementSibling : tlel;
		}
	}, 
	Files = {
		audio: ["flac", "alac", "wav", "m4a", "m4r", "aac", "ogg", "mp3", "opus"],
		video: ['webm', 'ogv', 'ogm', 'mp4', 'm4v', 'flv', "3gp"],
		image: ["jpeg", "jpg", "png", "svg", "gif"],
		arch: ['zip', 'rar', '7z']},
	KeyCodes = {
		codew: ['{', '[', '(', '\'', '"', '@'],
		symbs: ['"', '*', '(', '`'],
		quots: ['^', '>'],
		doubs: ['%', '~'],
		specl: [8, 86]},
	LC = {
		mcp: ru ? "В посте" : "Post",
		mcw: ru ? "В окне" : "Fixed Window",
		file: ru ? "Файл" : "File",
		repl: ru ? "Ответ" : "Reply",
		hide: ru ? "Скрыть" : "Hide",
		edit: ru ? "Изменить" : "Edit",
		view: ru ? "Просмотр" : "View",
		newp: ru ? " новых " : " new ",
		omit: ru ? " ответов " : " omited ",
		delp: ru ? " удаленных " : " deleted ",
		cframe: ru ? "Положение видеоплеера" : "Content Frame",
		subscrb: ru ? "Отслеживать" : "Subscribe",
		updprog: ru ? "Обновление..." : "Updating...",
		updauto: ru ? "Автообновление" : "Autoupdate",
		postdel: ru ? 'Пост удалён.' : "Post is deleted.",
		loadnew: ru ? "Подгрузить посты" : "Load New Posts",
		clipopup: ru ? "Закреплять превью постов" : "Clipping Popup Posts",
		mrk_to_del: ru ? "Отметить для удаления" : "Mark to delete",
		snd_notify: ru ? "Звуковое уведомление" : "Sound Notifications",
		fnd_src_wth: ru ? "Искать оригинал в" : "Find source with",
		clck_img_to: ru ? " - Нажмите на картинку" : " - Click the image",
		update_title: ru ? "Автоматически обновлять тред каждые %s% секунд" : "Automatically update thread every %s% seconds",
		snd_notify_title: ru ? "Оповещать о новых постах звуковым уведомлением" : "Add notification sound for new loaded posts",
		maxr: ru ? "Макс. разрешенный рейтинг" : "Max Allowing Rating",
		vsyz: ru ? "Размер видеоплеера" : "Video Size",
		expd: ru ? " для увеличения" : " to expand",
		vitf: ru ? " для просмотра" : " to view this file",
		pvid: ru ? " для воспроизведения" : " to play video",
		allw: ru ? "раскрытых" : "allowed",
		page: ru ? " страниц" : " page",
		line: ru ? " строк" : " line",
		play: ru ? "Играть" : "Play",
		add: ru ? "Добавить" : "Add",
		names: {
			'ru': ['Анонимус', 'Доброкодер', 'Лоуренс', 'Анонимный эксперт', 'Добропок', 'Экспериментатор'],
			'en': ['Anonymous', 'Developer', 'Lawrense', 'Anonymous Expert', 'Slowpoke', 'Experimenter']
		},
		emb: {
			'title': ru ? 'Включает встраивание для внешних ссылок и поддержку oEmbed API' : 'Enable oEmbed API support',
			'txt': ru ? 'Встраивание ссылок' : 'Embedded Media Links',
			'url': ru ? 'vstraivanije_dla_vneshnih_ssilok' : 'embedded_media_links'
		},
		tm: {
			's': ru ? 'cек' : 'sec',
			'm': ru ? 'мин' : 'min',
			'h': ru ? 'ч' : 'h'
		},
		few: {
			'u-a': ru ? "а" : "\'s",
			'u-b': ru ? "ов" : "s",
			'u-c': ru ? "ы" : "s",
			'u-d': ru ? "и" : "\'s",
			'en': ru ? "" : "s",
			'ru': ru ? "а" : ""
		},
		Month: {
			'01': ru ? " Январь "   : " January "   ,
			'02': ru ? " Февраль "  : " February "  ,
			'03': ru ? " Март "     : " March "     ,
			'04': ru ? " Апрель "   : " April "     ,
			'05': ru ? " Май "      : " May "       ,
			'06': ru ? " Июнь "     : " June "      ,
			'07': ru ? " Июль "     : " July "      ,
			'08': ru ? " Август "   : " August "    ,
			'09': ru ? " Сентябрь " : " September " ,
			'10': ru ? " Октябрь "  : " October "   ,
			'11': ru ? " Ноябрь "   : " November "  ,
			'12': ru ? " Декабрь "  : " December "
		},
		Weekday: {
			'0': ru ? " (Вс) " : " (Sun) " ,
			'1': ru ? " (Пн) " : " (Mon) " ,
			'2': ru ? " (Вт) " : " (Tue) " ,
			'3': ru ? " (Ср) " : " (Wed) " ,
			'4': ru ? " (Чт) " : " (Thu) " ,
			'5': ru ? " (Пт) " : " (Fri) " ,
			'6': ru ? " (Cб) " : " (Sat) " 
		}
	}
	
	/***--[ Utilites ]--***/
	Array.prototype.isThere = matchIndex
	String.prototype.isThere = matchIndex
	String.prototype.allReplace = function(obj, r) {
		var retStr = this;
		for (var x in obj) {
			retStr = retStr.replace((r ? x : new RegExp(x, 'g')), obj[x])
		}
		return retStr
	}
	String.prototype.repeat = function(num) {
		return new Array(num + 1).join(this);
	}
	String.prototype.fext = function() {
		return this.split('.').pop().toLowerCase();
	}
	function matchIndex(str) {
		return this.indexOf(str) >= 0;
	}
	function $route(el, Fn) {
		while (el) {
			var tn = (typeof Fn == "string" ? el.querySelector(Fn) : Fn(el));
			if (tn)
				return (typeof tn == "object" ? tn : el);
			el = el.parentNode;
		}
	}
	setlSValue = function (name, value, sess) {
		var stor = sess ? sessionStorage : localStorage;
		if (typeof name === 'object') {
			for (var key in name) {
				stor.setItem(key, (name[key] === null ? value : name[key]));
			}
		} else {
			stor.setItem(name, value);
		}
	}
	function getlSValue(name, def, sess) {
		var stor = sess ? sessionStorage : localStorage;
		if (name in stor) {
			var v = stor.getItem(name);
			v = v == 'false' ? false : 
				v == 'true' ? true : v;
			return v;
		} else {
			stor.setItem(name, def);
			return def;
		}
	}
	function getKeyByValue(obj, value) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (obj[prop] === value)
					return prop;
			}
		}
	}
	callback = function(e) {
		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}
	var btnTamplate = '<a class="r{Fn} icon" r{Act}><img src="/images/blank.png" title="r{title}" alt="r{alt}"></a>\n',
		refTamplate = '<a r{N} href="/r{brd}/res/r{tid}.xhtml#ir{pid}" onmouseover="ShowRefPost(event,\'r{brd}\', r{tid}, r{pid})" onclick="Highlight(event, \'r{pid}\')">&gt;&gt;r{L}r{pid}</a>',
		btnDerpibooru = btnTamplate.allReplace({'r{Fn}': "search_derpibooru", 'r{Act}': 'onclick="revSearch(\'@img_src\')"', 'r{title}': 'Derpibooru reverse search', 'r{alt}': 'derp'}),
		btnGoogle = btnTamplate.allReplace({'r{Fn}': "search_google", 'r{Act}': 'href="//www.google.com/searchbyimage?image_url=@img_src" onclick="window.open(this.href,\'_blank\');return false"', 'r{title}': LC.fnd_src_wth +' Google', 'r{alt}': 'ggl'}),
		btnIqdb = btnTamplate.allReplace({'r{Fn}': "search_iqdb", 'r{Act}': 'href="//iqdb.org/?url=@img_src" onclick="window.open(this.href,\'_blank\');return false"', 'r{title}': LC.fnd_src_wth +' iqdb', 'r{alt}': 'iqdb'});
	/*** Derpibooru Reverse Search ***/
	revSearch = function(imgSrc) {
		var form = $setup('form', {'method': "post", 'action': "https://derpibooru.org/search/reverse", 'target': "_blank", 'enctype': "multipart/form-data", 'hidden': "",
			'html': '<input id="url" name="url" type="text" value="'+ imgSrc +'"><input id="fuzziness" name="fuzziness" type="text" value="0.25">'}, null);
		document.body.appendChild(form).submit(); form.remove();
	}
	//-- Get Page name from Url
	function getPageName(url, r) {
		var a = url.split('/'), p = a.pop(), out = !p ? a.pop() : p;
		return r ? out : decodeURIComponent(out);
	}
	//-- Remove Zero whitespaces and invalid characters (like ") from Url Links
	function escapeUrl(url) {
		var eUrl = encodeURI(url).allReplace({'%2?5?E2%2?5?80%2?5?8B': '', '%2?5?3C/?\\w*%2?5?3E': '', '%2?5?22': ''});
		return decodeURI(eUrl);
	}
	function escapeUChar(char) {
		return char.allReplace({'U+0022': '"', 'U+0025': '%', 'U+0028': '(', 'U+002A': '*', 'U+003E': '>', 'U+0060': '`', 'U+007E': '~'}, true);
	}
	function ParseUrl(url) {
		var m = (url || document.location.href).match(/(?:https?:\/\/([^\/]+))?\/([^\/]+)\/(?:(\d+)|res\/(\d+)|(\w+))(?:\.x?html)?(#i?(\d+))?/);
		return m ? {host: m[1], board: m[2], page: m[3], thread: m[4], desk: m[5], pointer: m[6], pid: m[7]} : {};
	}
	function GetElements(el) { 
		var node = (el || document);
		return {
			posts: node.getElementsByClassName('post'), 
			links: node.querySelectorAll('.message a:not(.cm-link), .file > a[href$=".webm"]:not(.cm-link), .file > a[href$=".pdf"]:not(.cm-link)') }
	}
	function _cid(pid) {
		var n = new RegExp(/(\d+)/).exec(pid);
		return Number((n[1] || 0));
	}
	function _unc(str, n) {
		return str ? str : (n || 'Unknown');
	}
	function _t(last) { 
		return (new Date).getTime() - (last ? parseInt(last) : 0);
	}
	function _show(el) { el.classList.remove('hidout') }
	function _hide(el) { el.classList.add('hidout') }
	function _bitonum(arr, hex) {
		var hexNum = "";
		for (var i = 0; i < arr.length; i++) {
			hexNum += arr[i].toString(16);
		}
		return hex ? '0x'+ hexNum : parseInt(hexNum, 16);
	}
	function _b64Str(arr) {
		var base64String = "";
		for (var i = 0; i < arr.length; i++) {
			base64String += String.fromCharCode(arr[i]);
		}
		return btoa(base64String)
	}
	setupOptions = function (obj, option, sess) {
		if (obj.type === 'checkbox')
			val = obj.checked;
		if (obj.tagName === 'SELECT')
			val = obj.value;
		HM[option] = val;
		setlSValue(option, val, sess);
	}
	
	/************************************************************************/
	function getDataTime(jsonDT) {
		var date = new RegExp(/(\d+)\-(\d+)\-(\d+)\ (\d+\:\d+)(\:\d+)/).exec(jsonDT),
			year = date[1], month = date[2], day = date[3], hmin = date[4], sec = date[5],
			uDate = new Date(month +" "+ day +", "+ year +" "+ hmin + " GMT+0300"),
			Time = uDate.toLocaleTimeString(),
			Month = LC.Month[month],
			weekDay = LC.Weekday[uDate.getDay()];
		return day + Month + year + weekDay + (Time.length === 7 ? "0" + Time.slice(0, 4) : Time.slice(0, 5)) +'<span class="t-sec">'+ sec +'</span>';
	}
	function getDataJSON(uri, Fn) {
		var apiReq = new XMLHttpRequest();
		apiReq.open('GET', uri, true);
		apiReq.send(null);
		apiReq.onreadystatechange = function() {
			if (apiReq.readyState !== 4) {
				return;
			}
			if (apiReq.status === 304) {
				alert('304 '+ apiReq.statusText);
			} else {
				try {
					var json = JSON.parse(apiReq.responseText);
				} catch(e) {
					Fn(1, e.toString(), null, this);
				} finally {
					Fn(apiReq.status, apiReq.statusText, (json || apiReq.responseText), this);
					Fn = null;
				}
			}
		}
	}
	function getFileReaderData(readAs, file, Fn) {
		var reader = new FileReader();
		reader.onload = function() {
			if (reader.readyState < 1) {
				console.log('No data has been loaded yet.');
				return;
			}
			if (reader.error) {
				console.log(reader.error);
			} else {
				try {
					var data = reader.result;
				} catch(e) {
					Fn(e.toString(), this);
				} finally {
					Fn(data, this);
					Fn = null;
				}
			}
		}
		switch (readAs.toLowerCase()) {
			case 'text': reader.readAsText(file, 'UTF-8');
				break;
			case 'string': reader.readAsBinaryString(file);
				break;
			case 'dataurl': reader.readAsDataURL(file);
				break;
			case 'arraybuffer': reader.readAsArrayBuffer(file);
				break;
		}
	}
	function getHanabiraFile(file, pid, brd, tId, pId, len) {
		var name, fileattach, info, filebtns, action = filebtns = '',
			m = 0.01572,
			src = file.src,
			fid = file.file_id,
			fmd = file.metadata,
			imgW = fmd.width,
			imgH = fmd.height,
			rating = file.rating,
			size = bytesMagnitude(file.size),
			type = file.type === 'code' ? 'text' : !file.type ? fmd.type : file.type,
			maXr = HM.maXrating.toLowerCase(),
			filename = getPageName(src),
			ext = filename.fext(),
			thumb = maXr === rating || maXr.match(/\d+/) >= rating.match(/\d+g?/) || 
				rating === 'sfw' ? file.thumb : 'images/'+ rating +'.png',
			thumbW = thumb !== file.thumb ? 200 : file.thumb_width,
			thumbH = thumb !== file.thumb ? 200 : file.thumb_height;
		if (brd === 'b' || brd === 'rf')
			name =  type == "image" ? getPageName(thumb).split('s')[0] +'.'+ ext :
					type == "video" ? fmd["File Name"] : fid.toString() + pid.toString() +'.'+ ext;
		else
			name = len > 1 && filename.length > 17 ? filename.substring(0, 17) + '...' : filename;
		if (['image', 'vector'].isThere(type)) {
			info = ext.slice(0, 1).toUpperCase() + ext.slice(1) +', '+ size +', '+ imgW +'×'+ imgH;
			filebtns = (len === 1 ? LC.clck_img_to + LC.expd : '') +'<br>'+ btnTamplate.allReplace({
				'r{Fn}': "edit_", 'r{Act}': 'href="/utils/'+ type +'/edit/'+ fid +'/'+ pid +'"', 'r{title}': LC.edit, 'r{alt}': '✎'}) +
				(btnGoogle + btnIqdb + btnDerpibooru).replace(/@img_src/g, 'http://'+ location.host +'/'+ src);
			action = 'expand_image(event, '+ imgW +', '+ imgH +')';
		} else {
			var meta, metatype = type == 'flash' ? 'Flash' : fmd.type,
				lines = fmd.lines, pages = fmd.pages, files = fmd.files_count;
				filebtns = (len === 1 ? LC.clck_img_to + LC.vitf : '') +'<br>';
			if (type == 'text') {
				meta = lines + LC.line + (lines === 1 ? LC.few['ru'] : lines < 5 ? LC.few['u-d'] : LC.few['en']),
				action = 'open_url(\'/utils/'+ type +'/'+ fid +'/'+ pid +'\', \'_blank\')'
			}
			if (type == 'pdf') {
				meta = imgW +'×'+ imgH +', '+ pages + LC.page + (pages === 1 ? LC.few['ru'] : pages < 5 ? LC.few['u-c'] : LC.few['en']);
			}
			if (type == 'archive') {
				thumb = 'src/png/1405/archive-icon.png';
				meta = files +' '+ LC.file.toLowerCase() + (files === 1 ? '' : files < 5 ? LC.few['u-a'] : LC.few['u-b']),
				action = 'open_url(\'/utils/'+ type +'/'+ fid +'/'+ pid +'\', \'_blank\')'
			}
			if (type == 'video') {
				metatype = fmd["File Type"] == 'WEBM' ? 'WebM' : fmd["File Type"];
				size = fmd["File Size"];
				filebtns = (len === 1 ? LC.clck_img_to + LC.pvid : '');
				meta = fmd["Image Size"] +' @ '+ fmd["Duration"];
			}
			if (type == 'music') {
				var brate = (fmd.bitrate / 1000).toFixed(0) + ' kbps',
					srate = (fmd.sample_rate / 1000).toFixed(1) + ' kHz',
					trlen = (fmd.length * m).toFixed(2).replace('.', ':'),
					trnam = _unc(fmd.artist) +' — '+ _unc(fmd.album),
					trnum = _unc(fmd.tracknumber, '0') +'/'+ _unc(fmd.totaltracks, '0');
				meta = trlen +' @ '+ brate +' / '+ srate +'<br>'+ (len > 1 && trnam.length > 40 ? trnam.substring(0, 40) +'<br>'+ trnam.slice(40) : trnam) +' / '+ _unc(fmd.title) +' ['+ trnum +']';
				filebtns = '';
			}
			info = metatype +', '+ size + (!meta ? '' : ', '+ meta);
		}
		filebtns += '</div>';
		var fileinfo = '<div class="fileinfo">'+ LC.file +': <a href="/'+ src +'" target="_blank" title="'+ filename +'">'+ name +'</a><br><em>'+ info +'</em>';
		var filethmb = '<a onclick="callback(event)" href="/'+ src +'" target="_blank"><img class="thumb" src="/'+ thumb +'" width="'+ thumbW +'" height="'+ thumbH +
						'" onclick="'+ action +'" alt="'+ filename +'"></a>\n</div>';
		var filediv = '<div id="file_'+ pId +'_'+ fid +'" class="file">';
		return fileattach = (len == 1 ? fileinfo + filebtns + filediv + filethmb : filediv + fileinfo + filebtns + filethmb);
	}
	function getHanabiraPost(postJson, arr, hush) {
		if (window.HTMLAudioElement && HM.SoundNotify)
			new Audio("/src/mp3/1406/musbox.mp3").play();
		if (!window_focused && !hush) {
			unread_count = unread_count + 1;
			Tinycon.setBubble(unread_count);
		}
		var threadId = arr ? arr[1] : Target.tid,
			postId = postJson.display_id,
			board = arr ? arr[0] : HM.URL.board,
			files = postJson.files,
			len = files.length,
			op = postJson.op,
			wrap = $setup((op ? 'div' : 'table'), {'id': 'post_'+ postId, 'class': (op ? 'oppost' : 'replypost') +' post'}, null),
			delicon = '<a class="delete icon"><input type="checkbox" id="delbox_r{post_id}" class="delete_checkbox" value="'+ postJson.thread_id +
				'" name="r{post_id}"><img src="/images/blank.png" title="'+ LC.mrk_to_del +'" alt="✕" onclick="this.parentNode.classList.toggle(\'checked\')"></a>\n',
			html = (op ? '' : '<tbody><tr><td class="doubledash">&gt;&gt;</td><td id="replyr{post_id}" class="reply">') +
				'<a name="ir{post_id}"></a><label>'+ 
					(op ? '<a class="hide icon" onclick="hide_thread(event, \'r{board}\',r{post_id});" href="/api/thread/r{board}/r{post_id}/hide.redir"><img src="/images/blank.png" title="'+ LC.hide +'" alt="﹅"></a>\n' +
						delicon + '<a class="unsigned icon" onclick="sign_thread(event, \'r{board}\',r{post_id});"><img src="/images/blank.png" title="'+ LC.subscrb +'" alt="✩"></a>\n' : delicon) +
					(board === 'mad' ? '<span class="iphash">' +
						'<span class="ipmark" style="background:rgba(0,0,0,.5)">&nbsp;</span><span class="ipmark" style="background:rgba(255,255,255,.5)">&nbsp;</span>' +
						'<span class="ipmark" style="background:rgba(25,25,25,.6)">&nbsp;</span><span class="ipmark" style="background:rgba(99,99,99,.6)">&nbsp;</span>' +
						'<span class="ipmark" style="background:rgba(175,175,175,.6)">&nbsp;</span></span>\n<img class="geoicon" src="/src/png/1408/polandball_kawaii_16.png" alt="(^ ^)" title="Polandball (^ ^)">\n' : '') +
					'<span class="replytitle">'+ postJson.subject +'</span>\n<span class="postername">'+ HM.defaultName(postJson.name) +'</span> '+ getDataTime(postJson.date) +
				' </label><span class="reflink"><a onclick="Highlight(0, r{post_id})" href="/r{board}/res/r{thread_id}.xhtml#ir{post_id}">No.r{post_id}</a></span>\n' +
				'<span class="cpanel"><a class="reply_ icon" onclick="GetReplyForm(event, \'r{board}\', r{thread_id}, r{post_id})">' +
				'<img src="/images/blank-double.png" style="vertical-align:sub" title="'+ LC.repl +'" alt=">>"></a></span><br>';
		for (var i = 0; i < len; i++) {
			html += getHanabiraFile(files[i], postJson.post_id, board, threadId, postId, len);
		}
		wrap.insertAdjacentHTML('afterbegin', html.allReplace({'r{board}': board, 'r{thread_id}': threadId, 'r{post_id}': postId}) + 
			(len > 1 ? '<br style="clear: both">' : '') +'<div class="postbody">'+ postJson.message_html +'</div><div class="abbrev"></div>' +
			(op ? '' : '</td></tr></tbody>'));
		$each(GetElements(wrap).links, parseLinks);
		$each(wrap.querySelectorAll('img.thumb[src="/thumb/generic/sound.png"]'), makeMagicAudio);
		if (hush)
			genReplyMap([wrap]);
		return [wrap, (op ? wrap.firstChild : wrap.firstChild.firstChild.lastChild)];
	}
	function getHanabiraAllPosts() {
		getDataJSON('/api/thread/'+ HM.URL.board +'/'+ HM.URL.thread +'/all.json?new_format&message_html',
		function(status, sText, json, xhr) {
			for (var i = 0, jpid, pnid, jsonPost = json.result.posts; HM.Elems.posts[i]; i++) {
				pnid = _cid(HM.Elems.posts[i].id);
				jpid = !jsonPost[i] ? 9999999 : jsonPost[i].display_id;
				if (pnid != jpid) {
					if (pnid < jpid)
						$setup(HM.Elems.posts[i], {'class': "deleted"}).querySelector('.doubledash').setAttribute('style', "display:inline");
					if (pnid > jpid) {
						var derefl = refTamplate.allReplace({'r{N}': 'style="text-decoration:none"', 'r{brd}': HM.URL.board, 'r{tid}': HM.URL.thread, 'r{pid}': jpid, 'r{L}': ''}),
							dealp = document.getElementsByClassName('allowed-posts')[0],
							apnode = document.getElementById(HM.Elems.posts[i].id),
							temp = getHanabiraPost(jsonPost[i]);
						$placeNode('before', apnode, temp[0]);
						if (!dealp)
							postCount.insertAdjacentHTML('afterend', '<span class="allowed-posts" style="color:#666;font-size:14px"> | '+ LC.allw +': '+ derefl +'</span>');
						else
							dealp.insertAdjacentHTML('beforeend', ', '+ derefl);
						genReplyMap(HM.Elems.posts);
					}
				}
			}
		});
	}
	function updateThread(evt) {
		if (thread_updating)
			return updateTimer(evt);
		update.textContent = LC.updprog;
		thread_updating = true;
		getDataJSON('/api/thread/'+ HM.URL.board +'/'+ Target.tid +'/new.json?new_format&message_html&last_post='+ _cid(Target.last().id),
			function parseNewPosts(status, sText, json, xhr) {
				if (status !== 200 || json.error) {
					errorMsg = !json.error ? status +' '+ sText : json.error.message +' '+ json.error.code;
					updater.innerHTML = '<strong style="color:#ff3428">'+ errorMsg +'</strong>';
					setTimeout(function() { $setup(updater, {'html': ''}, null).appendChild(update) }, 5000);
				} else {
					var i, temp, tpcount = HM.Elems.posts.length,
						pCount = json.result.posts_count,
						el = json.result.posts,
						len = el ? el.length : 0;
					if (len > 0) {
						for (i = 0; i < len; i++) {
							temp = getHanabiraPost(el[i]);
							Target.thread().appendChild(temp[0]);
						}
						tpcount = tpcount + len;
					}
					if (evt !== null) {
						if (tpcount != pCount)
							getHanabiraAllPosts();
						postCount.textContent = pCount + LC.omit;
					}
				}
				update.textContent = LC.loadnew;
				thread_updating = false;
				updateTimer(evt);
				genReplyMap(HM.Elems.posts);
			}
		);
	}
	function updateTimer(evt) {
		if (evt === null) return;
		if (evt) { clearTimeout(timer_id); timer_id = 0; }
		timer_id = setTimeout((HM.AutoUpdate ? updateThread : function() {
			getDataJSON('/api/thread/'+ HM.URL.board +'/'+ HM.URL.thread +'.json?new_format',
				function(status, sText, json, xhr) {
					if (json.result) {
						var i = json.result.posts_count - HM.Elems.posts.length - fCont[2],
							p = i > 0 ? i : 0, n = i < 0 ? i : 0, postNew;
							fCont = [fCont[0] + p, fCont[1] + n, fCont[2] + i];
							postNew = '( '+ (fCont[0] > 0 ? '+'+ fCont[0]+ LC.newp : '') +
									 ' • '+ (fCont[1] < 0 ? fCont[1] + LC.delp : '') +')';
						postCount.textContent = HM.Elems.posts.length + LC.omit + postNew;
					}
				});
			updateTimer();
		}), HM.UpdateInterval().int);
	}
	
	/************************************************************************/
	function oEmbedMedia(link, type, embed, provider, endpoint, arg) {
		var mediaUrl = escapeUrl(link.href);
		getDataJSON((endpoint || 'http://api.embed.ly/1/oembed?url=') + mediaUrl +'&format=json', function(status, sText, data, xhr) {
			if (status !== 200 || !data) {
				$setup(link, {'target': '_blank'}, null);
			} else {
				var descript = data.provider_url == 'pastebin.com' ? data.description.split(' | ').pop() : data.description,
					name = !data.title ? getPageName(mediaUrl) : data.title.allReplace({' - YouTube': '', ' - Pastebin.com': ''}, true);
				if (!provider)
					provider = name.toLowerCase().isThere(data.provider_name.toLowerCase()) ? '' : data.provider_name + ': ';
				if (arg || !arg && data.html && data.type != "link") {
					switch (data.provider_name) {
						case 'SoundCloud':
							type = 'sc';
							break;
						case 'BandCamp':
							type = 'bc';
							break;
						case 'Google Docs':
							type = 'document';
							break;
					}
					if (!embed && data.html)
						embed = data.html;
					$setup(link, {'href': undefined, 'src': mediaUrl, 'onclick': 'loadMediaContainer(event.target)'}, null);
				}
				$setup(link, {'class': 'cm-link', 'rel': 'nofollow', 'title': descript, 'text': provider + name}, null);
				HM.LinksMap[mediaUrl] = {Name: provider + name, Title: descript, Embed: embed, Type: type};
				setlSValue('LinksCache', JSON.stringify(HM.LinksMap));
			}
		});
	}
	function attachFile(el, type, lR) {
		var fileUrl = escapeUrl(el.href),
			fileName = getPageName(fileUrl),
			name = fileName.length > 17 ? fileName.substring(0, 17) + '...' : fileName,
			embed = type === 'img' ? '<div class="url-image">'+ LC.file +': <a target="_blank" href="'+ fileUrl +'" title="'+ fileName +'" download>'+ name +'</a>\n'+
				(btnGoogle + btnIqdb + btnDerpibooru).replace(/@img_src/g, fileUrl) +'</div><img style="border:medium none;cursor:pointer" src="'+ fileUrl +'" class="thumb" alt="'+
				fileName +'" width="200" onclick="this.setAttribute(\'width\', this.getAttribute(\'width\') == \'200\' ? \'85%\' : \'200\')" >' : '<video '+
				(type === 'audio' ? 'width="350" height="80" poster="/src/png/1405/waveform.png"' : 'r{wh}') + ' controls><source src="'+ fileUrl +'"></source></video>',
			attach = function(e) {
				$setup(el, {'class': 'cm-link', 'rel': 'nofollow', 'onclick': 'loadMediaContainer(event.target)', 'href': undefined, 'src': fileUrl}, null);
				if (!lR)
					$setup(el, {'text': (type === 'img' ? 'Image' : type === 'audio' ? 'Audio' : 'Video') + ': ' + fileName}, null);
				HM.LinksMap[fileUrl] = {Name: fileName, Title: '', Embed: embed, Type: type};
				setlSValue('LinksCache', JSON.stringify(HM.LinksMap));
			};
		$setup(type, {'src': fileUrl, 'width': getVSize('w'), 'height': getVSize('h'), 'controls': ''}, {'load': attach,
			'loadedmetadata': attach, 'error': function(e) { lR ? el.setAttribute('rel', 'nofollow') : oEmbedMedia(el) }
		});
	}
	function parseLinks(link) {
		var iframe = '<iframe r{wh} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen',
			regex = /.+/, embed = '', prov = '', v = 1, endp, type = 'video',
			href = escapeUrl(link.href), EXT = href.fext();
		/************************* Reflinks ************************/
		if (href.isThere("/res/") && href.isThere("dobrochan")) {
			var targ = ParseUrl(href), refl = $route(link, '.reflink a'),
				from = ParseUrl(refl.href);
			if (targ != null && targ.thread) {
				var reply_id = !targ.pid ? targ.thread : targ.pid,
					diffb = targ.board != HM.URL.board,
					dataArr = [HM.URL.board, from.thread, from.pid, (diffb ? targ.board : '')];
				if (!link.textContent.isThere(">>"))
					$setup(link, {'href': href.replace(/https?:\/\/dobrochan\.\w+/, ''), 'text': '>>'+ (diffb ? targ.board +'/' : '') + reply_id, 
						'onclick': 'Highlight(event, "'+ reply_id +'")', 'onmouseover': 'ShowRefPost(event,"'+ targ.board +'", '+ targ.thread +', '+ reply_id +')'}, null);
				if (!repliesMap[reply_id])
					repliesMap[reply_id] = new Array(0);
				if (!JSON.stringify(repliesMap[reply_id]).isThere(JSON.stringify(dataArr)))
					repliesMap[reply_id].push(dataArr);
				return link.className = 'cm-link';
			}
		}
		if (!HM.oEmbedAPI)
			return setlSValue('LinksCache', '{}');
		/********* HTML5 Audio/Video & Images *********/
		if (Files.video.concat(Files.audio.concat(Files.image)).isThere(EXT)) {
			return attachFile(link, (Files.image.isThere(EXT) ? 'img' : Files.audio.isThere(EXT) ? 'audio' : 'video'), (link.firstChild.tagName === 'IMG'));
		}
		/********************* PDF JS *********************/
		if (href.isThere("/pdf/") && href.isThere(".pdf")) {
			HM.LinksMap[href] = {Embed: iframe +' src="'+ href +'">', Type: 'pdf'};
			return $setup(link, {'class': 'cm-link', 'rel': 'nofollow', 'onclick': 'loadMediaContainer(event.target)', 'href': undefined, 'src': href}, null);
		}
		/*************************** Простоплеер **************************/
		if (href.isThere("pleer.com/tracks/")) {
			regex = /(?:https?:)?\/\/(?:www\.)?pleer\.com\/tracks\/([\w_-]*)/g;
			pleer = $setup('embed', {'class': 'prosto-pleer', 'width': '410', 'height': '40', 'type': "application/x-shockwave-flash",
				'src': href.replace(regex, "//embed.pleer.com/track?id=$1")}, null)
			return !link.parentNode ? link.className = 'cm-link' : $placeNode('replace', link, pleer);
		}
		/************************* YouTube *************************/
		if (href.isThere("youtu")) {
			embed = iframe +' src="//www.youtube.com/embed/$1$3?$2$4&autohide=1&wmode=opaque&enablejsapi=1&theme=light&html5=1&rel=0&start=$5">';
			if (href.isThere("youtube.com/watch?") || href.isThere("youtube.com/playlist?"))
				regex = /(?:https?:)?\/\/(?:www\.)?youtube\.com\/(?:watch|playlist)\?.*?(?:v=([\w_-]*)|(list=[\w_-]*))(?:.*?v=([\w_-]*)|.*?(list=[\w_-]*)+)?(?:.*?t=(\d+))?/g;
			if (href.isThere("youtu.be"))
				regex = /(?:https?:)?\/\/(?:www\.)?youtu\.be\/([\w_-]*)(?:.*?(list=[\w_-]*))?(?:.*?t=([\w_-]*))?/g;
			if (href.isThere("playlist?"))
				v = 2;
			prov = 'YouTube: ';
		}
		/************************** Vimeo **************************/
		if (href.isThere("vimeo")) {
			regex = /(?:https?:)?\/\/(?:www\.)?vimeo\.com\/(?:.*?\/)?(\d+)(?:.*?t=(\d+))?/g;
			embed = iframe +' src="//player.vimeo.com/video/$1?badge=0&color=ccc5a7#t=$2">';
			prov = 'Vimeo: ';
		}
		/************************** Coub *************************/
		if (href.isThere("coub.com/view/")) {
			regex = /(?:https?:)?\/\/(?:www\.)?(?:coub\.com)\/(?:view)\/([\w_-]*)/g;
			embed = iframe +'="true" src="//coub.com/embed/$1?muted=false&amp;autostart=false&originalSize=false&hideTopBar=false&noSiteButtons=false&startWithHD=false">';
			prov = 'Coub: ';
		}
		/************************* RuTube *************************/
		if (href.isThere("rutube.ru/video/")) {
			regex = /(?:https?:)?\/\/(?:www\.)?(?:rutube\.ru)\/(?:video)\/([\w_-]*)\/?/g;
			embed = iframe +' src="//rutube.ru/video/embed/$1?autoStart=false&isFullTab=true&skinColor=fefefe">';
			prov = 'RuTube: ';
		}
		/************************* Видео m@il.ru  *************************/
		if (href.isThere("mail.ru/") && href.isThere("/video/")) {
			regex = /(?:https?:)?\/\/(?:my\.)?(?:mail\.ru\/mail\/)([\w_-]*)(?:\/video)\/([\w_-]*\/\d+\.html)/g;
			embed = iframe +' src="//videoapi.my.mail.ru/videos/embed/mail/$1/$2">';
			prov = 'M@il.RU Видео: ';
		}
		/************************* Яндекс.Видео *************************/
		if (href.isThere("video.yandex.ru/users/")) {
			if ((/\/view\/(\d+)/).exec(href)) {
				endp = '//video.yandex.ru/oembed.json?url='
				prov = 'Яндекс.Видео: ';
			}
		}
		/************************* VK.com ************************/
		if (href.isThere("vk.com/video")) {
			regex = /(?:https?:)?\/\/vk\.com\/video(?:_ext\.php\?oid=)?(-?\d+)(?:&id=|_)(\d+).?(hash=[\w_-]*)?(.*?hd=-?\d+)?(.*?t=[\w_-]*)?/g;
			embed = iframe +' src="//vk.com/video_ext.php?oid=$1&id=$2&$3$4$5">';
			link.setAttribute('href', href.replace(regex, 'https://vk.com/video$1_$2?$3$4$5'));
			prov = 'VK Видео: '; v = 3;
		}
		/************************* Pastebin *************************/
		if (href.isThere("pastebin.com/")) {
			regex = /(?:https?:)?\/\/(?:www\.)?(?:pastebin\.com)\/([\w_-]*)/g;
			embed = '<iframe frameborder="0" src="//pastebin.com/embed_js.php?i=$1">';
			prov = 'Pastebin: '; type = 'document';
		}
		/************************* Custom iframe ************************/
		if (href.isThere("/iframe/") || href.isThere("/embed/")) {
			regex = /(.+)/g; v = 0;
			embed =  iframe +' src="'+ href +'">';
			if (!href.isThere("/html/"))
				link.setAttribute("href", href.allReplace({'embed/': "", 'be.com': ".be"}));
		}
		/****************************************************************/
		if (HM.LinksMap[href]) {
			if (HM.LinksMap[href].Embed)
				$setup(link, {'href': undefined, 'src': href, 'onclick': 'loadMediaContainer(event.target)'}, null);
			$setup(link, {'class': 'cm-link', 'rel': 'nofollow', 'text': HM.LinksMap[href].Name,
				'title': HM.LinksMap[href].Title}, null);
		} else if (!href) return;
		else oEmbedMedia(link, type, href.replace(regex, embed), prov, endp, (href.match(regex) != null && regex.exec(href)[v] != undefined));
	}
	loadMediaContainer = function(el) {
		if (el.tagName === 'IMG')
			el = el.parentNode;
		var cont, src = el.getAttribute("src"),
			type = HM.LinksMap[src].Type,
			hash = btoa(getPageName(src, true));
		if (type === 'pdf'|| HM.MC === 0 && !['img', 'audio', 'bc'].isThere(type)) {
			var last = contentFrame.lastChild;
				cont = $setup('div', {'class': 'content-frame '+ type, 'id': 'content_'+ hash,
					'html': HM.LinksMap[src].Embed.allReplace({'r{wh}': 'class="full-size"', '(width|height)="\\d+"': '$1="100%"'})
				}, null);
			if (last.id != 'content_'+ hash) {
				if (last.classList[0] === 'content-frame') {
					contentFrame.replaceChild(cont, last);
					_hide(contMarker);
				} else
					contentFrame.appendChild(cont)
			} else _hide(contMarker);
			contentFrame.classList.remove('hidup');
		} else {
			var csEl = type +'-container', idEl = type +'_'+ hash,
				contEl = document.getElementsByClassName(csEl)[0];
				embc = type === 'bc' ? HM.LinksMap[src].Embed : 
					HM.LinksMap[src].Embed.allReplace({'r{wh}': getVSize('html'),
						'(width)="\\d+"': '$1="'+getVSize((type == 'sc' ? 'h' : 'w'))+'"',
						'(height)="\\d+"': '$1="'+getVSize('h')+'"'}),
				cont = $setup('div', {'id': idEl, 'class': csEl, 'html': embc}, null);
			if (type === 'img')
				contEl = document.getElementById(idEl);
			if (!contEl || contEl.id != idEl) {
				if (contEl)
					contEl.remove();
				if (['document', 'audio'].isThere(type))
					$placeNode('before', el, cont)
				else
					$route(el, jumpCont).appendChild(cont);
			} else {
				contEl.remove();
				cont = [];
			}
		}
		if (type === 'video')
			HM.VActive = [el, cont];
	}
	function jumpCont(el) {
		var pb = el.querySelector('.postbody');
		if (pb) {
			var prev = pb.previousElementSibling,
				node = prev.style['clear'] === 'both' ? prev : pb;
			if (node.previousElementSibling.className != 'postcontent')
				node.insertAdjacentHTML('beforebegin', '<span class="postcontent"></span>');
			return node.previousElementSibling;
		} else return false;
	}
	placeMedia = function(e) {
		var val = e.target.value, cont = HM.VActive[1],
			vsset = e.target.parentNode.parentNode.parentNode.nextElementSibling;
		if (val === 'windowFrame') { HM.MC = 0;
			_hide(vsset);
			if (cont) {
				contentFrame.appendChild($setup(cont, {'class': 'content-frame video', 'id': 'content_'+cont.id.split('_')[1]}, null));
				$setup(cont.firstChild, {'width': '100%', 'height': '100%'}, null);
				_show(contMarker);
			}
		}
		if (val === 'postContent') { HM.MC = 1;
			_show(vsset);
			if (cont) {
				$placeNode('prepend', $route(HM.VActive[0], jumpCont), $setup(cont, {'class': 'video-container', 'id': 'video_'+cont.id.split('_')[1]}, null));
				$setup(cont.firstChild, {'class': '', 'width': getVSize('w'), 'height': getVSize('h')}, null);
				_hide(contMarker);
				contentFrame.classList.add('hidup');
			}
		}
		setlSValue('EmbedIn', val)
	}
	function getVSize(i) {
		var w = getlSValue('VWidth', 480), h = getlSValue('VHeight', 360),
			val = w == 360 ? 1 : w == 480 ? 2 : w == 720 ? 3 : w == 854 ? 4 : 0;
		if (i === 'html') return 'width="'+w+'" height="'+h+'"';
		if (i === 'value') return val;
		if (i === 'text') return w+'×'+h;
		return (i == 'w' ? w : i == 'h' ? h : 0);
	}
	setVSize = function(slider) {
		var p = slider.value;
		function size(w, h) {
			var vplayed = document.querySelector('.video-container > iframe');
			var scplayed = document.querySelector('.sc-container > iframe');
			setlSValue({'VWidth': w, 'VHeight': h});
			document.getElementById('vsize-textbox').textContent = '('+w+'×'+h+')';
			if (vplayed) vplayed.width = w, vplayed.height = h;
			if (scplayed) scplayed.width = h, scplayed.height = h;
		}
		p == 1 ? size(360, 270) : p == 2 ? size(480, 360) :
		p == 3 ? size(720, 480) : p == 4 ? size(854, 576) : size(0, 0);
	}
	
	/****************** MagicAudio Player *********************/
	function _cover(MAF, artist, album, dataImage) {
		var aid, baid, aa, ALB = getKeyByValue(HM.AlbumArts, dataImage);
		if (ALB)
			dataImage = '$>'+ ALB;
		if (!dataImage)
			aid = artist;
		else
			aid = _unc(artist) +' — '+ _unc(album);
		if (HM.AlbumArts[aid]) {
			aa = HM.AlbumArts[aid]
			if (aa.slice(0, 2) === '$>')
				aid = aa.slice(2, aa.length)
			dataImage = HM.AlbumArts[aid];
		} else {
			HM.AlbumArts[aid] = dataImage;
			setlSValue('AlbumArts', JSON.stringify(HM.AlbumArts));
			if (ALB)
				aid = ALB;
		}
		baid = btoa(unescape(encodeURIComponent(aid))).replace(/=/g, '61');
		if (!document.getElementById('cover-'+ baid)) {
			document.body.appendChild($setup('style', { 'id': 'cover-'+ baid,
				'text': '#album-'+ baid +'{background-image:url('+ dataImage +')}'
			}, null))
		}
		MAF.id = 'album-'+ baid;
	}
	function AVMetadata(MAF, metadata) {
		if ("coverArt" in metadata) {
			var image = metadata.coverArt, itype = _bitonum([image.data[0], image.data[1], image.data[2], image.data[3]], true),
				dataImage = 'data:image/'+ (itype == "0xffd8ffe0" ? 'jpeg' : 'png') +';base64,'+ _b64Str(image.data);
			_cover(MAF, metadata.artist, metadata.album, dataImage)
		}
	}
	function MAParser(MAF, blob) {
		parse_audio_metadata(blob, function(metadata) {
			if ("picture" in metadata) {
				getFileReaderData('dataurl', metadata.picture, function(dataImage){
					_cover(MAF, metadata.artist, metadata.album, dataImage)
				})
			}
		}, function(e) {
			console.log(e)
		});
	}
	function MDPBlockParser(MAF, metadata) {
		if ('METADATA_BLOCK_PICTURE' in metadata) {
			var bpic = metadata['METADATA_BLOCK_PICTURE'],
				blob = new Blob([Base64Binary.decodeArrayBuffer(bpic)]);
			BlobView.get(blob, 0, blob.size, function (page, error) {
				var ptype, mimeL, mime, descL, desc, width, height, color, icolor, imageL, image, dataImage;
				if (error)
					return errorCallback(error);
				// PictureType = { 0: Other, 1: 32x32 pixels 'file icon' (PNG only), 2: Other file icon, 3: Cover (front), 4: Cover (back), 5: Leaflet page,
				// 6: Media (e.g. label side of CD), 7: Lead artist/lead performer/soloist, 8: Artist/performer, 9: Conductor, 10: Band/Orchestra, 
				ptype  = page.getUint8(3) // 11: Composer, 12: Lyricist/text writer, 13: Recording Location, 14: During recording, 15: During performance,
				// 16: Movie/video screen capture, 17: A bright coloured fish, 18: Illustration, 19: Band/artist logotype, 20: Publisher/Studio logotype }
				mimeL  = page.getUint8(4 + 3)      // MIME Type section size - [image/png 0x09, image/jpeg 0x12]
				         page.advance(5 + 3)
				mime   = page.readASCIIText(mimeL) // MIME Type section
				descL  = page.getUint8(5 + 3 + mimeL + 3) // Description section size
				         page.advance(4)
				desc   = page.readASCIIText(descL)        // Description section (it's somthing like comment)
				width  = page.getUnsignedByteArray(7 + 3 + mimeL + 3 + descL, 3)                  // image size width (hex)
				height = page.getUnsignedByteArray(8 + 3 + mimeL + 3 + descL + 3, 3)              // image size height (hex)
				color  = page.getUnsignedByteArray(9 + 3 + mimeL + 3 + descL + 3 + 3, 3)          // image color depth [8, 16, 24, 32] (hex)
				icolor = page.getUnsignedByteArray(10 + 3 + mimeL + 3 + descL + 3 + 3 + 3, 3)     // maybe color profile, i dont know
				imageL = page.getUnsignedByteArray(11 + 3 + mimeL + 3 + descL + 3 + 3 + 3 + 3, 3) // image section size (hex)
				image  = page.getUnsignedByteArray(11 + 3 + mimeL + 3 + descL + 3 + 3 + 3 + 3 + 3, _bitonum(imageL)) // image section
				if (image.length + image.length < page.viewLength) { // in some files image section length is wrong
					dataImage = bpic.match(/\/9j\/.+/g)[0];
				} else {
					dataImage = _b64Str(image);
				}
				_cover(MAF, metadata['ARTIST'], metadata['ALBUM'], 'data:'+ mime +';base64,'+ dataImage)
			})
		}
	}
	function makeMagicAudio(afSrc) {
		afSrc = afSrc.parentNode
		var afInf = $route(afSrc, 'em'),
			artalb = (/kHz\s*(.+\s—\s.+)\s\//).exec(afInf.textContent)[1],
			magicAudio = $setup('div', {'class': 'magic-audio thumb artwork', 'html': '<div class="ma-controls"><a src="'+
							afSrc.href +'" class="ma-play"></a><a class="ma-pause hidout"></a></div>'}, null);
		afInf.classList.add('magic-info');
		if (afInf.nextElementSibling)
			afInf.nextElementSibling.remove();
		if (HM.AlbumArts[artalb])
			_cover(magicAudio, artalb);
		$setup(magicAudio.querySelector('.ma-play'), {'onclick': 'initMagicAudio(event)'}, null);
		$setup(magicAudio.querySelector('.ma-pause'), {'onclick': 'initMagicAudio(event)'}, null);
		$placeNode('replace', afSrc, magicAudio)
	}
	initMagicAudio = function(e) {
		var btn = e.target
		if (btn.className == 'ma-pause') {
			_active(btn, btn.previousElementSibling);
			return HM.Played.pause();
		}
		var magicAudio = btn.parentNode.parentNode, AS = btn.getAttribute('src'),
			prev_p = document.querySelector('.ma-pause:not(.hidout)');
		if (HM.Played != null) {
			if (prev_p != null)
				_active(prev_p, prev_p.previousElementSibling);
			HM.Played.pause(); 
		}
		function _active(el, es) {
			el.classList.toggle('hidout');
			es.classList.toggle('hidout');
		}
		function _nextTrack(e) {
			var file = document.getElementById(atob(this.id)), p = file.querySelector('.ma-pause'),
				nxtf = file.nextElementSibling, nxtfp = nxtf.querySelector('.ma-play');
			_active(p, p.previousElementSibling);
			if (nxtfp) nxtfp.click();
		}
		_active(btn, btn.nextElementSibling);
		if (['flac', 'alac'].isThere(AS.fext())) {
			HM.Played = new AV.Player.fromURL(AS);
			if (!magicAudio.id) {
				HM.Played.asset.get('metadata', function(md) {
					AVMetadata(magicAudio, md)
				});
			}
			HM.Played.on('end', _nextTrack)
		} else {
			HM.Played = $setup(new Audio(AS), {}, {'ended': _nextTrack,
				'loadedmetadata': function(e) {
					var moz = typeof mozRTCSessionDescription !== "undefined",
						mozMdata = moz ? this.mozGetMetadata() : false;
					if (!magicAudio.id && mozMdata && Object.keys(mozMdata).length > 0) {
						MDPBlockParser(magicAudio, mozMdata)
					} else if (!magicAudio.id) {
						var oReq = new XMLHttpRequest();
						oReq.open("GET", AS, true);
						oReq.responseType = "arraybuffer";
						oReq.send(null);
						oReq.onload = function() {
							var blob = new Blob([oReq.response]);
							if (blob) {
								MAParser(magicAudio, blob)
							}
						}
					}
				}
			});
		}
		HM.Played.id = btoa(btn.parentNode.parentNode.parentNode.id)
		HM.Played.play()
	}
	
	/*** Wakabamark Buttons Engine ***/
	wmarkText = function (openTag, closeTag) {
		if (!HM.TextArea)
			HM.TextArea = YukiTextArea;
		var	CED = HM.TextArea.id.isThere('code'),
		 	val = HM.TextArea.value,
			end = HM.TextArea.selectionEnd,
			start = HM.TextArea.selectionStart,
			selected = val.substring(start, end),
			getext = start === end ? window.getSelection().toString() : selected,
			cont = (typex(CED ? 'gm' : '')).exec(selected),
			ql = closeTag.slice(0, 1) === '\n',
			sp = closeTag.slice(0, 1) === '%',
			c = closeTag.slice(0, 1) === '`',
			s = closeTag.slice(0, 1) === '~',
			e = c ? '`' : '';
			function typex(gmi) {
				return new RegExp('^(\\s*)(.*?)(\\s*)$', gmi)
			}
		if (ql) {
			markedText = openTag + getext.replace(/\n/gm, closeTag);
		} else {
			if (s && (selected.slice(0, 1) === '~' || val.substring(end, end + 1) === '~'))
				openTag = openTag.slice(0, 1), closeTag = closeTag.slice(0, 1);
			markedText = cont === null ? (sp || c ? openTag + e +'\n'+ getext +'\n'+ e + closeTag :
				selected.replace(typex('gm'), '$1'+ openTag +'$2'+ closeTag +'$3')) :
				cont[1] + openTag + cont[2] + closeTag + cont[3];
		}
		eOfs = markedText.length, sOfs = 0;
		if (cont != null && !cont[2] && !ql) {
			sOfs = openTag.length;
			eOfs = sOfs + selected.length;
		}
		$setup(HM.TextArea, {'class': 'ta-inact', 'value': val.substring(0, start) + markedText + val.substring(end)}, null).focus();
		if (!CED) setlSValue('SafeText', JSON.stringify(YukiTextArea.value), true)
		HM.TextArea.setSelectionRange(start + sOfs, start + eOfs);
	}
	function keyMarks(e) {
		if (e.target.tagName === 'TEXTAREA') {
			HM.TextArea = e.target;
			TA = true;
		} else {
			HM.TextArea = YukiTextArea;
			TA = false;
		}
		var YRT = HM.TextArea.id === 'yukireplyText',
			CED = HM.TextArea.id === 'code_edit_ta',
			key = String.fromCharCode(e.charCode),
			val = HM.TextArea.value,
			end = HM.TextArea.selectionEnd,
			start = HM.TextArea.selectionStart,
			selected = val.substring(start, end),
			active = selected.length > 0;
			function autoselect() {
				if (!active) {
					var fw = val.substring(start, val.length).match(/^(.*?)(?:\s|$)/);
					return (fw[1] ? false : true);
				} else return true;
			}
		if (YRT && TA && KeyCodes.doubs.isThere(key)) {
			if (HM.LastKey === key || active) {
				wmarkText(key + (active ? key : ''), key + key)
				HM.LastKey = null;
				return callback(e);
			}
		}
		if (YRT && TA && KeyCodes.symbs.isThere(key)) {
			if (autoselect()) {
				wmarkText(key, (key === '(' ? ')' : key))
				return callback(e);
			}
		}
		if (CED && TA && KeyCodes.codew.isThere(key)) {
			if (autoselect()) {
				wmarkText(key === '@' ? '\	' : key,
					     (key === '(' ? ')' :
					      key === '{' ? '}' :
					      key === '[' ? ']' :
					      key === '@' ? '\n\	': key))
				return callback(e);
			}
		}
		if (YRT && KeyCodes.quots.isThere(key)) {
			var sSp = val.substring(start - 1, start);
			if (['\n', ''].isThere(sSp) || selected.isThere('\n')) {
				key = key === '^' ? '*' : key;
				wmarkText(key +' ', '\n'+ key +' ');
				return callback(e);
			}
		}
		if (TA && e.keyCode != 8) { HM.LastKey = key;
			if (HM.TextArea.className === 'ta-inact') {
				HM.TextArea.setSelectionRange(end, end);
				HM.TextArea.removeAttribute('class');
			}
		}
	}
	
	/*** Strike Converter ***/
	//* @ by 	DesuDesuTalk
	StrikeConvert = function(e) {
		var sregex = /(?:\~\~\~(.*?[^\s])\~\~\~)|(?:\~\~(.*?[^\s])\~\~)/g;
		YukiTextArea.value = YukiTextArea.value.replace(sregex,
		function(match, str, str2, len, prefix) {
			var sMarked, sT, lm;
			if (str) {
				sMarked = str.replace(/[^\s]+/g, function(word){ 
					return word + word.replace(/./g, '^H');
				});
			}
			if (str2) {
				var word = str2.trim().split(/\s+/g).length;
				if (word === 1)
					sT = '^H', lm = str2.length;
				else if (word > 1)
					sT = '^W', lm = word;
				sMarked = str2 + sT.repeat(lm);
			}
			return sMarked;
		})
	}
	
	/*** Base64Binary ***/
	//* @ original code 	https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
	//* @ copyright 		Daniel Guerrero
	Base64Binary = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		/* will return a Uint8Array type */
		decodeArrayBuffer: function(input) {
			var bytes = (input.length / 4) * 3;
			var ab = new ArrayBuffer(bytes);
			this.decode(input, ab);
			return ab;
		},
		decode: function(input, arrayBuffer) {
			//get last chars to see if are valid
			var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
			var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));
			var bytes = (input.length / 4) * 3;
			if (lkey1 == 64) bytes--; //padding chars, so skip
			if (lkey2 == 64) bytes--; //padding chars, so skip
			var uarray;
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			var j = 0;
			if (arrayBuffer)
				uarray = new Uint8Array(arrayBuffer);
			else
				uarray = new Uint8Array(bytes);
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			for (i = 0; i < bytes; i += 3) {
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(input.charAt(j++));
				enc2 = this._keyStr.indexOf(input.charAt(j++));
				enc3 = this._keyStr.indexOf(input.charAt(j++));
				enc4 = this._keyStr.indexOf(input.charAt(j++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				uarray[i] = chr1;
				if (enc3 != 64) uarray[i + 1] = chr2;
				if (enc4 != 64) uarray[i + 2] = chr3;
			}
			return uarray;
		}
	}
	
	/*** Form Serialization ***/
	//* @ original code 	https://gist.github.com/bullgare/5336154
	//* @ copyright 		bullgare
	serializeArray = function(form) {
		var i, j, arr = new Array();
		if (!form || form.nodeName !== "FORM") {
			return;
		}
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
						case 'text':
						case 'hidden':
						case 'password':
						case 'button':
						case 'reset':
						case 'submit':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'checkbox':
						case 'radio':
							if (form.elements[i].checked) {
								arr.push({
									name: form.elements[i].name,
									value: form.elements[i].value });
							}
							break;
						case 'file':
							break;
					}
					break;
				case 'TEXTAREA':
					arr.push({
						name: form.elements[i].name,
						value: form.elements[i].value });
					break;
				case 'SELECT':
					switch (form.elements[i].type) {
						case 'select-one':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
						case 'select-multiple':
							for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
								if (form.elements[i].options[j].selected) {
									arr.push({
										name: form.elements[i].name,
										value: form.elements[i].options[j].value });
								}
							}
							break;
					}
					break;
				case 'BUTTON':
					switch (form.elements[i].type) {
						case 'reset':
						case 'submit':
						case 'button':
							arr.push({
								name: form.elements[i].name,
								value: form.elements[i].value });
							break;
					}
					break;
			}
		}
		return arr;
	}

	
	/*** Yuki Reply Form ***/
	//* @ original code 	https://github.com/tranquility-yuki/yukiscript
	//* @ copyright 		2013+, You
	function makeRandId(size) {
		var text = "", 
			possible = "0123456789abcdef",
			len = possible.length;
		if (!size)
			size = len;
		for (var i = 0; i < size; i++)
			text += possible.charAt(Math.floor(Math.random() * len));
		return text;
	}
	function arrayBufferDataUri(raw) {
		var base64 = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		var bytes = new Uint8Array(raw)
		var byteLength = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength = byteLength - byteRemainder
		var a, b, c, d, chunk
		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048) >> 12 // 258048 = (2^6 - 1) << 12
			c = (chunk & 4032) >> 6 // 4032 = (2^6 - 1) << 6
			d = chunk & 63 // 63 = 2^6 - 1
			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		} // Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]
			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
			// Set the 4 least significant bits to zero
			b = (chunk & 3) << 4 // 3 = 2^2 - 1
			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
			a = (chunk & 64512) >> 10 // 16128 = (2^6 - 1) << 8
			b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4
			// Set the 2 least significant bits to zero
			c = (chunk & 15) << 2 // 15 = 2^4 - 1
			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}
		return base64
	}
	function jpegStripExtra(input) { // result e.target.result;
		// Decode the dataURL
		var binary = atob(input.split(',')[1]);
		// Create 8-bit unsigned array
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		var orig = new Uint8Array(array);
		var outData = new ArrayBuffer(orig.byteLength)
		var output = new Uint8Array(outData);
		var posO = 2,
			posT = 2;
		output[0] = orig[0];
		output[1] = orig[1];
		while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
			if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
				posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
			} else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
				posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
			} else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
				var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
				for (var i = 0; i < l; i++) {
					output[posT++] = orig[posO++];
				}
				while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
					output[posT++] = orig[posO++];
				}
			} else {
				var l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
				for (var i = 0; i < l; i++) {
					output[posT++] = orig[posO++];
				}
			}
		}
		output[posT] = orig[posO];
		output[posT + 1] = orig[posO + 1];
		output = new Uint8Array(outData, 0, posT + 2);
		return "data:image/Jpeg;base64," + arrayBufferDataUri(output);
	}
	function difference(array1, array2) {
		var result = [];
		if (array2.length == 0) {
			return array1;
		}
		for (var i = 0; i < array1.length; i++) {
			if (!array2.isThere(array1[i])) {
				result.push(array1[i]);
			}
		}
		return result;
	}
	function bytesMagnitude(bytes) {
		return (bytes < 1024 ? bytes +' B' :
				bytes < 1024 * 1024 ? (bytes / 1024).toFixed(2) +' KB' :
				bytes < 1024 * 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) +' MB' :
											(bytes / 1024 / 1024 / 1024).toFixed(2) +' GB');
	}
	function dataURLtoBlob(dataURL, dataType) {
		// Decode the dataURL
		var binary = atob(dataURL.split(',')[1]);
		// Create 8-bit unsigned array
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		} // Return our Blob object
		return new Blob([new Uint8Array(array)], {
			type: dataType
		});
	}
	function yukiAddFile(e) { // FileList object
		var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
		if (fileList.length >= 5) {
			return alert('Пять файлов это максимум на Доброчане.');
		} // Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i++];) {
			if (fileList.length >= 5) {
				alert('Пять файлов это максимум на Доброчане.');
				break;
			}
			var f_name = f.name, f_ext = f_name.fext(),
				renamed = false;
			if (HM.RemoveFileName) {
				f_name = (makeRandId(32) + (f.name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
				renamed = true;
			}
			fileList.push({
				file: f,
				f_name: f_name,
				renamed: renamed,
				el: $setup('div', {'class': "yukiFile" +(Files.audio.isThere(f_ext) ? ' artwork' : ''), 'html': filepreview_tamplate.allReplace({
					'r{img}': Files.arch.isThere(f_ext) ? '/src/png/1405/archive-icon.png' : f_ext === 'webm' ? '/src/svg/1501/webm-file.svg' : '#transparent',
					'r{fname}': f_name, 'r{size}': bytesMagnitude(f.size)})
				}, null)
			});
			fileList[fileList.length - 1].el.querySelector('.yuki_clickable').onclick = (function(data) {
				return function(e) {
					var idx = fileList.indexOf(data);
					data.el.remove();
					delete fileList[idx];
					fileList.splice(idx, 1)
				}
			}(fileList[fileList.length - 1]))
			
			YukiFiles.appendChild(fileList[fileList.length - 1].el);
			
			// Closure to capture the file information.
			if (Files.audio.isThere(f_ext)) {
				var front = fileList[fileList.length - 1].el, 
					moz = typeof mozRTCSessionDescription !== "undefined";
				if (['ogg', 'opus'].isThere(f_ext) && moz) {
					var URL = window.URL || window.webkitURL, 
					HTMLAE = new Audio(URL.createObjectURL(f))
					HTMLAE.onloadedmetadata = function() {
						var mozMdata = this.mozGetMetadata();
						if (Object.keys(mozMdata).length > 0) {
							MDPBlockParser(front, mozMdata)
						}
					}
					HTMLAE.load()
				} else {
					getFileReaderData('arraybuffer', f, function(buffer) {
						var blob = new Blob([buffer]);
						if (['flac', 'alac', 'm4a'].isThere(f_ext)) {
							var AVAsset = new AV.Asset.fromBuffer(buffer);
							AVAsset.get('metadata', function(md) {
								AVMetadata(front, md)
							});
						} else {
							MAParser(front, blob)
						}
					})
				}
			}
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					// Render thumbnail.
					if (HM.RemoveExif && theFile.file.type.toLowerCase() === 'image/jpeg') {
						theFile.dataURL = jpegStripExtra(e.target.result);
						theFile['jpegStripped'] = true;
					} else {
						theFile.dataURL = e.target.result;
						theFile['jpegStripped'] = false;
					}
					if (theFile.file.type.match('image.*')) {
						theFile.el.querySelector('.preview_img').setAttribute('src', theFile.dataURL);
					}
				};
			})(fileList[fileList.length - 1]);
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}
	}
	function yukiPleasePost(e) {
		var formData = serializeArray(e.target),
			fd = new FormData();
		for (var i = 0; i < formData.length; i++) {
			fd.append(formData[i].name, formData[i].value);
		};
		for (var i = 0; i < fileList.length; i++) {
			if (HM.RemoveExif && fileList[i].file.type.toLowerCase() == 'image/jpeg' && !fileList[i].jpegStripped) {
				fileList[i].dataURL = jpegStripExtra(fileList[i].dataURL);
			}
			if (HM.RemoveFileName && !fileList[i].renamed) {
				fileList[i].f_name = (makeRandId(32) + (fileList[i].f_name.match(/\.[^\.]+$/) || [''])[0]).toLowerCase();
			}
			fd.append("file_" + (i + 1), dataURLtoBlob(fileList[i].dataURL, fileList[i].file.type), fileList[i].f_name);
			fd.append("file_" + (i + 1) + "_rating", fileList[i].el.querySelector("select[name='file_1_rating']").value);
		};
		fd.append("post_files_count", fileList.length)
		submitProcess(true);
		var ajaxPost = new XMLHttpRequest(), url = e.target.action +'?X-Progress-ID='+ _t() * 10000;
		ajaxPost.open('POST', url, true);
		ajaxPost.send(fd);
		ajaxPost.onreadystatechange = function() {
			if (ajaxPost.readyState !== 4) {
				return;
			}
			if (ajaxPost.status === 304) {
				submitProcess(false);
				alert('Не получилось отправить пост.\nПопробуйте чуть попозже ещё разок или перезагрузить страницу.\n\n-----------------------------\n'+ ajaxPost.statusText);
			} else {
				try {
					var rText = ajaxPost.responseText,
						errPost = rText.match(/\/error\/post\/\d+/),
						newThread = rText.match(/\/\w*\/res\/\d+\.xhtml/);
				} catch(e) {
					console.log(e);
				} finally {
					if (errPost) {
						getDataJSON(errPost, function(status, sText, err, xhr) {
							var msg = (/<td colspan='\d+' class='post-error'>(.+)<\/td>/).exec(err);
							var keys = ru ? ['капча', 'человек.'] : ['captcha', 'human.'];
							YukiReplyForm.querySelector('.error-msg').textContent = msg[1];
							if (keys.isThere(msg[1].split(' ').pop()))
								YukiCaptcha.removeAttribute('hidden');
							submitProcess(false);
							YukiReplyForm.previousElementSibling.querySelector('a.reply_.icon').click();
						});
					} else if (newThread && YukiThreadFrom.value == 0) {
						document.location.href = newThread;
					} else {
						if (YukiReplyForm.className === 'reply')
							YukiReplyForm.remove();
						YukiTextArea.value = '';
						submitProcess(false);
						setlSValue('SafeText', JSON.stringify(YukiTextArea.value), true);
						YukiReplyForm.querySelector('.error-msg').textContent = '';
						YukiCaptcha.setAttribute('hidden', '');
						YukiFiles.innerHTML = '';
						fileList = [];
						updateThread(null);
					}
				}
			}
		}
		return callback(e);
	}
	function submitProcess(st) {
		$setup(YukiSubmit, {'disabled': (st ? "disabled" : undefined)}, null);
		YukiSubmit.parentNode.classList.toggle('process')
	}
	yukiAttachCapcha = function(el) {
		if (fileList.length >= 5) {
			alert('Пять файлов это максимум на Доброчане.');
			return false;
		}
		var img = el.previousElementSibling;
		if (img.nodeName.toLowerCase() === 'img') {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL("image/png");
			f = {
				"name": 'talking_captcha.png',
				"size": dataURL.length * 6 / 8,
				"type": 'image/png'
			};
			fileList.push({
				file: f,
				renamed: false,
				f_name: 'talking_captcha.png',
				jpegStripped: true,
				el: $setup('div', {'class': "yukiFile", 'html': filepreview_tamplate.allReplace({
					'r{img}': dataURL, 'r{fname}': f.name, 'r{size}': bytesMagnitude(f.size)
				})}, null),
				dataURL: dataURL
			});
			fileList[fileList.length - 1].el.querySelector('.yuki_clickable').onclick = (function(data) {
				return function(e) {
					var idx = fileList.indexOf(data);
					data.el.remove();
					delete fileList[idx];
					fileList.splice(idx, 1)
				}
			}(fileList[fileList.length - 1]))
			YukiFiles.appendChild(fileList[fileList.length - 1].el);
		}
		return false;
	}
	function makeYukiReplyForm(e, brd, tid, pid) {
		if (Target.thread(tid) && HM.URL.thread != tid)
			Target.tid = tid;
		if (Target.board != brd)
			Target.board = brd;
		YukiThreadFrom.value = tid;
		YukiCaptchaImage.src = '/captcha/'+ brd +'/'+ _t() +'.png';
		$setup(YukiReplyForm, {'class': (!e ? '' : 'reply'), 'action': '/'+ brd +'/post/new.xhtml'}, null);
		if (topForm.querySelector('#captcha'))
			YukiCaptcha.removeAttribute('hidden');
		var post = !e ? topForm : $route(e.target, function(el) {
				var nodes = el.className.split(' ');
				return nodes.isThere('post') || nodes.isThere('popup');
			}), classes = post.className.split(' ');
			if (classes.isThere('post') || !e) $placeNode('after', post, YukiReplyForm);
		else
			if (classes.isThere('popup')) post.firstChild.firstChild.firstChild.appendChild(YukiReplyForm);
			if (pid && !YukiTextArea.value.isThere('>>'+ pid)) InsertInto(YukiTextArea, '>>'+ pid +'\r\n');
			if (e) shTopForm(null);
	}; GetReplyForm = makeYukiReplyForm;
	
	/*** Enchanted Hanabira ***/
	//* @ original code 	http://dobrochan.com/js/hanabira-0.5.1311-.js
	//* @ copyright 		Dobrochan
	function shTopForm(e, brd) {
		switch (e) {
			case null:
				$each([hideinfo, openbottomForm], _show);
				_hide(showinfo);
				break;
			default:
				switch (e.target.parentNode.id) {
					case 'hideinfotd':
						$each([hideinfo, openbottomForm], _show);
						_hide(postForm);
						break;
					case 'open-bottom-form':
						$placeNode('after', openbottomForm, postForm)
						_hide(openbottomForm);
						break;
				}
				switch (e.target.parentNode.id) {
					case 'hideinfodiv':
						pfplaceh.appendChild(postForm);
						_show(openbottomForm);
						_hide(hideinfo);
					case 'open-bottom-form':
						$each([showinfo, postForm], _show);
						makeYukiReplyForm(null, HM.URL.board, (HM.URL.thread || 0));
						ntCreate.className = YukiThreadFrom.value > 0 ? 'inactive' : 'selected';
						break;
				}
				return callback(e);
		}
	}; hide_info = shTopForm;
	
	BindDragRef = function(e) {
		if (HM.RefTab) {
			HM.RefTab.style.top = 9 + e.pageY - HM.RefTab.offsetHeight +'px';
			HM.RefTab.style.left = 9 + e.pageX - HM.RefTab.offsetWidth +'px';
		}
	}
	BindCloseRef = function(reftab) {
		var tr = $setup('tbody', {'html': '<tr><td>'}, null),
			drag = $setup('span', {'class': 'dpop'}, {
				'mousedown': function(e) {
					reftab.style['z-index'] = HM.zIndex + 1
					HM.RefTab = reftab; 
					return callback(e) }}),
			close = $setup('span', {'class': 'cpop icon', 'html': '<img src="/images/blank.png">'}, {
				'click': function(e) { reftab.remove() }}),
			closeAll = $setup('span', {'class': 'cpop all icon', 'html': '<img src="/images/blank.png">'}, {
				'click': function(e) {
					HM.zIndex = 0;
					$placeNode('remove', document.getElementsByClassName('popup'))}});
			$setup(reftab, {}, {
				'click': function(e) {
					HM.zIndex++ //HM.Refs[reftab.style.zIndex = HM.zIndex++] = reftab;
					reftab.style['z-index'] = HM.zIndex }}).appendChild(tr).click();
		$placeNode('append', tr.firstChild.firstChild, [close, closeAll, drag]);
	}
	BindRemoveRef = function(binded, reftab) {
		var to, timer = function(e) { to = setTimeout(function() {reftab.remove()}, 300) }
		$setup(binded, {}, {'mouseout': timer });
		$setup(reftab, {}, {'mouseout': timer,
			'mouseover': function(e) { clearTimeout(to); to = 0 }});
	}
	InsertInto = function(textarea, text, select) {
		var caretPos = textarea.caretPos,
			start = textarea.selectionStart,
			end = textarea.selectionEnd,
			val = textarea.value;
		if (textarea.createTextRange && caretPos) {
			caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == " " ? text + " " : text;
		} else if (textarea.setSelectionRange) {
			$setup(textarea, {'value': val.substring(0, end) + text + val.substring(end)}, null)
			.setSelectionRange(start + (select ? 0 : text.length), start + text.length);
		} else {
			textarea.value += text + " ";
		}
	}
	
	function openiFrame(url) {
		var last = contentFrame.lastChild,
			Id   = url.slice(7).allReplace({'/': '_'}),
			type = url.isThere('text') ? 'document' : 'pdf',
			cont = $setup('div', {'class': 'content-frame '+ type, 'id': Id,
				'html': '<iframe class="full-size" frameborder="0" src="'+url+'">'}, null);
		if (last.id != Id) {
			if (last.classList[0] === 'content-frame') {
				contentFrame.replaceChild(cont, last);
				_hide(contMarker);
			} else
				contentFrame.appendChild(cont)
		} else _hide(contMarker);
		contentFrame.classList.remove('hidup');
	}; open_url = openiFrame;
	
	function MagicPostView(e, brd, tid, pid) {
		var from, a = e.target, attach = getlSValue('AttachPopups', false),
			fa = $route(a, '.reflink a').getAttribute('href'),
			to0 = setTimeout(function() {
			var load, op = tid === pid,
				postid = (op ? 'post_' : 'reply') + pid,
				id = brd +'-'+ postid,
				set_style = function(r) {
					var w = window.innerWidth,
					x = e.pageX, y = e.pageY + 30,
					wx = w - x, y2 = y - r.offsetHeight - 45;
					if (y2 > 0)
						y = y2;
					if ((wx < 600 || wx < w / 2) && r.offsetWidth > wx) {
						var mw = w - 400;
						x = null;
					}
					if (from) {
						from.className = "reply-from";
						if (attach)
							from.removeAttribute('onmouseover');
					}
					r.setAttribute('style', 'top:'+ y +'px;max-width:'+
						(mw || wx) +'px;'+ (x == null ? 'right:0' : 'left:'+ x) +'px'+
						(attach ? ';z-index:'+ HM.zIndex : ''));
				},
				binded = function(e) {
					if (attach && !e)
						BindCloseRef(reftab);
					else
						BindRemoveRef(a, reftab);
					if (e)
						load = $setup('span', {'class': 'stub', 'text': LC.postdel}, null);
					reftab.firstChild.firstChild.appendChild(load);
					from = reftab.querySelector('a[href="'+ fa +'"]');
					set_style(reftab);
				},
				active = document.getElementById('ref-'+ id);
			if (active) {
				set_style(active);
				return active.click();
			}
			var reftab = $setup('table', {'class': (op ? 'oppost popup' : 'popup'), 'id': 'ref-'+ id, 'html': '<tbody><tr>'}, null),
				post = HM.LoadedPosts[id] || document.getElementById(postid);
			if (post) {
				load = $setup(post.cloneNode(true), {'id': 'load-' + id, 'class': undefined}, null);
				binded(post.className === 'stub' ? true : false);
			} else if (HM.URL.thread == tid) {
				binded(true);
			} else {
				loading = $setup('td', {'html': '<span class="waiting'+ Math.floor(Math.random() * 3) +
					' icon"><img src="/images/blank.png"></span>\n<span class="reply-from">Секунду...</span>'}, null);
				reftab.firstChild.firstChild.appendChild(loading);
				getDataJSON('/api/post/'+ brd +'/'+ tid +'/'+ pid +'.json?message_html&new_format',
				function(status, sText, json, xhr) {
					if (status !== 200 || json.error) {
						binded(true); HM.LoadedPosts[id] = load;
					} else {
						var temp = getHanabiraPost(json.result, [brd, tid, pid], true),
							node = op ? temp[0] : temp[1];
						HM.LoadedPosts[id] = node;
						load = $setup(node, {'id': 'load-'+ id, 'class': undefined}, null);
						binded();
					}
					loading.remove();
				});
			}
			document.body.appendChild(reftab);
			set_style(reftab);
		}, attach ? 200 : 100);
		$setup(a, {}, {'mouseout': function(e) {
			clearTimeout(to0); to0 = 0;
			if (from && !attach)
				from.removeAttribute('class');
		}});
	}; ShowRefPost = MagicPostView;
	
	function genReplyMap(posts) {
		$each(posts, function(post) {
			var cid = _cid(post.id), replies_links = new Array(0);
			if (repliesMap[cid]) {
				$each(repliesMap[cid], function(Id) {
					replies_links.push(refTamplate.allReplace({'r{N}': 'id="reply-link"', 'r{brd}': Id[0], 'r{tid}':
					(!Id[1] ? Id[2] : Id[1]), 'r{pid}': Id[2], 'r{L}': (Id[3] ? '❪'+ Id[0].toUpperCase() +'❫' : '')}));
				});
				var replies_div_arr = post.getElementsByClassName('reflinks'),
					replies_div = $setup('div', {'class': 'reflinks'}, null);
				if (replies_div_arr.length == 0)
					post.getElementsByClassName('abbrev')[0].appendChild(replies_div);
				else
					replies_div = replies_div_arr[0];
				replies_div.innerHTML = LC.repl + LC.few['u-c'] +': '+ replies_links.join(', ');
			}
		})
	}
	
	/************************************************************************/
	$setup(window, {}, {'keypress': keyMarks,
		'mousemove': BindDragRef,
		'mouseup': function(e) { HM.RefTab = null },
		'focus': function(e) {
			window_focused = true;
			Tinycon.setBubble(0);
			unread_count = unread_count * 0;
		},
		'blur': function(e) {
			window_focused = false;
		}
	});
	var updater = $setup('div', {'id': 'updater'}, null),
		update = $setup('a', {'text': LC.loadnew}, {'click': updateThread});
	updater.appendChild(update);
	
	function updtitle() {
		return LC.update_title.replace('%s%', HM.UpdateInterval().val)
	}
	var SoundNotify = $setup('label', {'title': LC.snd_notify_title, 'html':'<input type="checkbox" hidden><span class="checkarea"></span>\n'+ LC.snd_notify}, null),
		ckbxNotify = $setup(SoundNotify.querySelector('input'), {'checked': HM.SoundNotify}, {
		'change': function(e) { setupOptions(this, 'SoundNotify', true) }
	});
	var AutoUpdate = $setup('label', {'title': updtitle(), 'html':'<input type="checkbox" hidden><span class="checkarea"></span>\n'+ LC.updauto}, null),
		ckbxUpdate = $setup(AutoUpdate.querySelector('input'), {'checked': HM.AutoUpdate}, {
		'change': function(e) { setupOptions(this, 'AutoUpdate', true);
			updateTimer(e);
		}
	});
	var setUpdInt = $setup('input', {'hidden': '', 'style': 'width:34px;margin:0 4px', 'id': 'int-upd', 'min': '15', 'max': '120', 'type': "number", 'value': HM.UpdateInterval().val}, {
		'input': function() {
			setlSValue('UpdateInterval', this.value, true);
			AutoUpdate.title = updtitle();
		},
		'mouseout': function() {
			setTimeout(function() {
				$setup(tsec, {'hidden': undefined, 'text': "\n⟨"+ HM.UpdateInterval().val +" "+ LC.tm['s'] +".⟩"}, null);
				setUpdInt.setAttribute('hidden', '');
			}, 1000)
		}
	});
	var tsec = $setup('span', {'class': 't-sec', 'id': 'int-stat', 'text': "\n⟨"+ HM.UpdateInterval().val +" "+ LC.tm['s'] +".⟩"}, {
		'click': function(e) {
			this.setAttribute('hidden', '');
			setUpdInt.removeAttribute('hidden');
		}
	});
	
	var contentFrame = $setup('div', {'class': 'content-window hidup', 'html': '<div id="shadow-box"></div><label id="close-content-window"></label>'}, {
		'click': function(e) {
			switch (e.target.id) {
				case 'shadow-box': contentFrame.classList.add('hidup');
					_show(contMarker)
					break;
				case 'close-content-window': contentFrame.classList.add('hidup');
					e.target.nextElementSibling.remove();
					HM.VActive = [];
					break;
			}
		}
	}),
	contMarker = $setup('label', {'id': 'show-content-window', 'class': 'hidout'}, {
		'click': function(e) {
			contentFrame.classList.remove('hidup');
			_hide(this)
		}
	});
	
	var postCount = $setup('label', {'class': 'post-count', 'text': HM.Elems.posts.length + LC.omit}, null);
	var ntCreate = $setup('label', {'id': 'new-thread-create', 'class': 'inactive', 'html': 'Новый тред в\n<span class="t-sec">/'+ HM.URL.board +'/</span>'}, {
		'click': function(e) {
			if (this.className != 'selected') {
				this.className = 'selected';
				YukiThreadFrom.value = 0;
			} else {
				this.className = 'inactive';
				YukiThreadFrom.value = HM.URL.thread;
			}
		}
	});
	var magicPanel = $setup('div', {'id': 'magic-panel', 'html': '<table><tbody><tr><td class="f-sect"><span onchange="placeMedia(event)"><input '+
		(HM.MC == 0 ? 'checked' : '') +' value="windowFrame" name="cont_p" type="radio">\n'+ LC.mcw +'\n<input '+
		(HM.MC == 1 ? 'checked' : '') +' value="postContent" name="cont_p" type="radio">\n'+ LC.mcp +'\n</span></td><td class="s-sect">'+
		LC.cframe +'</td></tr><tr class="vsset'+ (HM.MC == 0 ? ' hidout' : '') +'"><td class="f-sect"><input onclick="" onchange="setVSize(this)" min="1" value="'+
		getVSize('value') +'" step="1" max="4" type="range" name="v_size"></td><td class="s-sect">'+ LC.vsyz +'\n<span id="vsize-textbox">('+
		getVSize('text') +')</span></td></tr><tr><td class="f-sect"><select id="max-allowed-rating"><option class="rating_SFW">SFW</option>'+
		'<option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select></td>'+
		'<td class="s-sect">'+ LC.maxr +
		'</td></tr><tr><td class="f-sect"><label><input id="oembedapi" type="checkbox" hidden><span class="checkarea" style="font-size:20px"></span></label></td>'+
		'<td class="s-sect"><a title="'+ (HM.oEmbedAPI ? LC.emb['title'] : '') +'">'+
		(HM.oEmbedAPI ? 'Hint: '+ LC.emb['txt'] : '<u>http://www.magicpanel.div/'+ LC.emb['url'] +'</u>') +'</a></td></tr><tr><td class="f-sect"><label><a class="paperclip '+
		(HM.AttachPopups ? '' : 'inactive') +'"><input id="attach-popups" hidden="" type="checkbox"><img onclick="this.parentNode.classList.toggle(\'inactive\')" src="/src/png/1411/attachpopup.png"></a></label></td><td class="s-sect">'+ LC.clipopup +'</td></tr></tbody></table>'}, null);
	$setup(magicPanel.querySelector('#max-allowed-rating'), {'value': HM.maXrating, 'class': 'rating_'+ HM.maXrating.replace('-', '')}, {
		'change': function(e) { setupOptions(this, 'maXrating');
			this.className = this.querySelector('option:checked').className;
		}
	});
	$setup(magicPanel.querySelector('#attach-popups'), {'checked': HM.AttachPopups}, {
		'change': function(e) { setupOptions(this, 'AttachPopups') }
	});
	$setup(magicPanel.querySelector('#oembedapi'), {'checked': HM.oEmbedAPI}, {
		'change': function(e) {
			setupOptions(this, 'oEmbedAPI')
			var txtBox = this.parentNode.parentNode.nextElementSibling.firstChild;
			if (this.checked) {
				$each(HM.Elems.links, parseLinks);
				$setup(txtBox, {'title': LC.emb['title'], 'text': 'Hint: '+ LC.emb['txt']}, null);
			} else {
				$setup(txtBox, {'title': undefined, 'html': '<u>http://www.magicpanel.div/'+ LC.emb['url'] +'</u>'}, null);
			}
		}
	});
	
	var magicBottom = $setup('a', {'id': 'magic-bottom', 'html': '<img width="38" height="28" src="/src/png/1409/list4.png">'}, {
		'click': function(e) {
			var el = this.parentNode;
			if (el.previousElementSibling.id === 'magic-panel') {
				el.removeAttribute('class');
				magicPanel.remove()
			} else {
				el.setAttribute('class', 'active');
				$placeNode('before', el, magicPanel)
			}
		}
	});
	
	var openbottomForm = $setup('div', {'id': 'open-bottom-form', 'class': 'hideinfo', 'html': '[\n<a onclick="hide_info(event, \''+
		HM.URL.board +'\')">'+ (ru ? 'Раскрыть форму' : 'Unhide form') +'</a>\n]'}, null);
	var hideinfo = document.getElementById('hideinfodiv');
	var showinfo = document.getElementById('hideinfotd');
	var postForm = document.getElementById('postFormDiv');
	var pfplaceh = document.getElementById('postform_placeholder');
	var delForm = document.getElementById('delete_form');
	var topForm = document.getElementById('postform');
	var deli = delForm.querySelector('input[name="password"]'), pass = deli.value,
		filepreview_tamplate = '[<a class="yuki_clickable">убрать</a>]<br><img class="preview_img" src="r{img}"><br><span class="file_name">r{fname}</span><br>\
			<span class="file_name">r{size}&nbsp;</span><select name="file_1_rating" class="rating_SFW" onchange=\'this.setAttribute("class", this.querySelector("option:checked").className)\'>\
			<option class="rating_SFW">SFW</option><option class="rating_R15">R-15</option><option class="rating_R18">R-18</option><option class="rating_R18G">R-18G</option></select>';
		replyform_tamplate = '<input name="thread_id" value="'+ (HM.URL.thread || 0) +'" type="hidden"><input name="task" value="post" type="hidden">\
			<div class="error-msg" style="text-align:center;color:#FFF;background-color:#E04000"></div>\
			<table><tbody id="yukidropBox"><tr class="post-count"></tr><tr class="droparrow inactive"></tr></tbody><tbody style="display:inline-block">\
			<tr id="trname"><td><input placeholder="'+ HM.defaultName() +'" name="name" size="30" value="" type="text">\
				<label class="sagearrow'+ (HM.Sage ? '' : ' inactive') +'"><input name="sage" type="checkbox" hidden><img src="/src/svg/1409/Sage.svg"></label>\
				<span style="float:right">&nbsp;<a id="close-form" title="Убрать" onclick="YukiReplyForm.remove()"><img src="/images/delete.png" alt="Remove"></a></span>\
			</td></tr>\
			<tr id="trsubject"><td><input placeholder="'+ (ru ? 'Тема' : 'Subject') +'" name="subject" size="30" maxlength="64" value="" type="text">\
				<label class="submit-button"><span>'+ (ru ? 'Отправка' : 'Sending') +'</span>\n<input type="submit" value="'+ (ru ? 'Отправить' : 'Post') +'"></label>\
				<span class="wmark-buttons-panel" style="float:right;text-align:right">\
					<a onclick="StrikeConvert()" class="wmark-button" title="Перевод символов страйка в нотацию wakabamark" style="visibility:hidden"><span>{~}</span>&nbsp;</a>\
					<a onclick="wmarkText(\'* \', \'\\n* \')" class="wmark-button" title="Список"><span>◉</span></a>&nbsp;\
					<a onclick="wmarkText(\'~~\', \'~~\')" class="wmark-button" title="Зачеркнутый"><img src="/src/svg/1405/~S-mark.svg" alt="~$"></a>&nbsp;\
					<a onclick="wmarkText(\'_\', \'_\')" class="wmark-button" title="Курсивный"><img src="/src/svg/1405/i-mark.svg" alt="i"></a>&nbsp;\
					<a onclick="wmarkText(\'**\', \'**\')" class="wmark-button" title="Жирный"><img src="/src/svg/1405/-b-mark.svg" alt="b"></a>&nbsp;\
					<a onclick="wmarkText(\'`\', \'`\')" class="wmark-button" title="Код"><img src="/src/svg/1405/[c]-mark.svg" alt="[c]"></a>&nbsp;\
					<a onclick="wmarkText(\'%%\', \'%%\')" class="wmark-button spoiler" title="Спойлер">&middot;<strong>%%</strong>&middot;</a>&nbsp;\
					<a onclick="wmarkText(\'> \', \'\\n> \')" class="wmark-button" title="Цитировать выделенное"><img src="/src/svg/1405/„q”-mark.svg" alt="&gt;"></a>\
				</span></td></tr>\
			<tr id="trmessage"><td><textarea placeholder="'+ (ru ? 'Текст сообщения' : 'Message Text') +'" style="resize:both;height:180px" id="yukireplyText" name="message" cols="80" rows="8"></textarea>\
				<br><div id="gamePlaceholder"></div></td></tr>\
			<tr id="trcaptcha">\
				<td><span><img alt="Капча" id="yuki-captcha-image" style="vertical-align:middle;margin:2px" src="">&nbsp;\
					<span onclick="yukiAttachCapcha(this)" class="yuki_clickable" title="Прикрепить капчу" style="color:#999">[+]</span></span><br>\
					<input autocomplete="off" name="captcha" type="text" hidden>\
				</td></tr>\
			<tr class="hidout" id="trrempass"><td><input name="password" size="35" value="'+ pass +'" type="password"></td></tr>\
			<tr id="trfile"><td id="files_parent"><input id="post_files_count" name="post_files_count" value="1" type="hidden">\
				<div id="file_1_div"><label><input id="dumb_file_field" type="file" hidden multiple><input type="button" value="'+
			LC.add +' '+ (ru ? LC.file.toLowerCase() : LC.file) + LC.few['u-c'] +'"></label>\n<span style="font-size:66%"><label><input hidden type="checkbox" '+
			(HM.RemoveExif ? 'checked' : '') +' onchange="setupOptions(this, \'RemoveExif\')"><span class="checkarea"></span>\nУбирать Exif</label>\n<label><input type="checkbox" hidden '+ 
			(HM.RemoveFileName ? 'checked' : '') +' onchange="setupOptions(this, \'RemoveFileName\')"><span class="checkarea"></span>\nУбирать имя файла</label></span></div></td></tr>\
			<tr class="hidout" id="trgetback"><td><select name="goto"><option value="board">board</option><option value="thread" selected>thread</option></select></td></tr>\
		</tbody></table><div id="files_placeholder"></div>';
		YukiReplyForm = $setup('form', {'id': "yukipostform", 'method': "post", 'enctype': "multipart/form-data", 'html': replyform_tamplate}, {'submit': yukiPleasePost});
	var YukiTextArea = YukiReplyForm.querySelector("#yukireplyText"),
		YukiFiles = YukiReplyForm.querySelector('#files_placeholder'),
		YukiCaptcha = $setup(YukiReplyForm.querySelector('input[name="captcha"]'), {}, {
			'focus': function(e) { YukiCaptchaImage.click() },
			'keypress': function(e) { CaptchaProcess(e, (ru ? 'ru' : 'en')) }
		}),
		YukiThreadFrom = YukiReplyForm.querySelector('input[name="thread_id"]'),
		YukiFileDumb = $setup(YukiReplyForm.querySelector('#dumb_file_field'), {}, {'change': yukiAddFile}),
		YukiSubmit = $setup(YukiReplyForm.querySelector('input[type="submit"]'), {}, {'click': StrikeConvert}),
		YukiCaptchaImage = $setup(YukiReplyForm.querySelector('#yuki-captcha-image'), {}, {
			'click': function(e) { this.src = '/captcha/'+ Target.board +'/'+ _t() +'.png' }
		}),
		YukidropBox = $setup(YukiReplyForm.querySelector("#yukidropBox"), {}, {
			'dragover': callback,
			'dragenter': function(e) {
				var items = e.dataTransfer.mozItemCount || '';
				if (this.classList[0] != 'thumb') {
					this.firstChild.textContent = LC.add +' '+ items +' '+ LC.file.toLowerCase() +
						(items == 1 ? '' : !items ? LC.few['u-c'] : items < 5 ? LC.few['u-a'] : LC.few['u-b']);
					this.classList.add('thumb');
				}
			},
			'dragleave': function(e) {
				this.firstChild.textContent = '';
				this.classList.remove('thumb');
			},
			'drop': function(e) {
				yukiAddFile(e);
				this.firstChild.textContent = '';
				this.classList.remove('thumb');
				return callback(e);
			}
		});
	$setup(YukiTextArea, {'value': JSON.parse(getlSValue('SafeText', JSON.stringify(YukiTextArea.value), true))}, {
		'click': function(e) { this.classList.remove('ta-inact') },
		'keyup': function(e) {
			var height = _cid(this.style['height']);
			if (height + 26 < this.scrollHeight)
				this.style['height'] = this.scrollHeight +'px';
			setlSValue('SafeText', JSON.stringify(this.value), true);
		},
		'keydown': function(e) {
			if (KeyCodes.specl.isThere(e.keyCode))
				keyMarks(e);
		}
	});
	$setup(YukiReplyForm.querySelector('input[name="sage"]'), {'checked': HM.Sage}, {
		'change': function(e) { setupOptions(this, 'Sage', true);
			this.parentNode.classList.toggle('inactive');
		}
	});
	
	deli.nextElementSibling.onclick = function(e) {
		setTimeout(function(){
			window.stop();
			if (Target.thread())
				setTimeout(updateThread, 1000);
		}, 200)
	}
	
	hideinfo.querySelector('hr').remove();
	hideinfo.removeAttribute('style');
	_hide(postForm);
	
	$placeNode('append', document.body, [magicBottom, contentFrame, contMarker]);
	$each(HM.Elems.links, parseLinks);
	genReplyMap(HM.Elems.posts);
	if (HM.URL.thread) {
		$placeNode('append', delForm, [
			openbottomForm,
			updater,
			SoundNotify,
			document.createElement("br"),
			AutoUpdate,
			tsec,
			setUpdInt
		]);
		$placeNode('prepend', YukiReplyForm, ntCreate);
		$placeNode('after', Target.thread(), postCount);
		updateTimer();
	}
	
	for (var i = 0, thumbLinks = document.querySelectorAll('.file > a:not(.cm-link)'); tLink = thumbLinks[i++];) {
		tLink.setAttribute('onclick', 'callback(event)');
	}
	for (var i = 0, iqdbIcons = document.querySelectorAll('a.search_iqdb.icon'); lIco = iqdbIcons[i++];) {
		lIco.insertAdjacentHTML('afterend', '\n'+ btnDerpibooru.replace('@img_src', lIco.href.split('=').pop()))
	}
	for (var i = 0, arcImage = document.querySelectorAll('img[src="/thumb/generic/archive.png"], img[src="/thumb/generic/7z.png"]'); aImg = arcImage[i++];) {
		aImg.src = '/src/png/1405/archive-icon.png';
	}
	for (var i = 0, sndImage = document.querySelectorAll('img.thumb[src="/thumb/generic/sound.png"]'); sImg = sndImage[i++];) {
		makeMagicAudio(sImg)
	}
	for (var i = 0, rateImages = document.querySelectorAll('img.thumb[alt="unrated"], img.thumb[alt^="r-1"]'); rImg = rateImages[i++];) {
		var finf = $route(rImg, '.fileinfo'),
			elSz = new RegExp(/(\d+)(?:×|x)(\d+)/).exec(finf.querySelector('em').textContent),
			a = $setup('a', {'href': finf.querySelector('a').href, 'target': "_blank"}, null);
		rImg.parentNode.appendChild(a); a.appendChild(rImg);
		if (Files.video.isThere(a.href.fext()))
			parseLinks(a);
		else
			$setup(rImg, {'width': '200', 'height': '200', 'onclick': 'expand_image(event, '+elSz[1]+', '+elSz[2]+')'}, null);
	}
}
