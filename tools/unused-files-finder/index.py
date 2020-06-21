import os
from pathlib import Path
from shutil import copyfile

path ="..\\..\\"
print("Listing files...")
with open("imglist.txt", "w") as writing:
	with open("jslist.txt", "w") as writing2:
		for root, dirs, files in os.walk(path):
			for file in files:
				filesp = file.replace("\n","")
				if(file.endswith(".png") or file.endswith(".gif") or file.endswith(".jpg")):
					filesp = file.split("\\")
					writing.write(filesp[len(filesp)-1]+"\n")
				elif(file.endswith(".js") or file.endswith(".ts") or file.endswith(".coffee")):
					filesp = str(root)+"\\"+str(file)
					if filesp.find("node_modules") == -1 and filesp.find("tools") == -1:
						writing2.write(filesp+"\n")
writing.close()
writing2.close()
print("Finished listing the files.")
print("Checking files...")
with open("unused.txt","w") as unusedfile:
	with open("imglist.txt", "r") as reading3:
		for imgline in reading3:
			found = False
			imgline_parsed = imgline.replace("\n","")
			imgline_noext = imgline_parsed.split(".")[0]
			print("Checking {}".format(imgline_parsed))
			with open("jslist.txt", "r") as reading:
				for jsline in reading:
					jsline_parsed = jsline.replace("\n","")
					with open(jsline_parsed, "r", encoding="utf-8") as reading2:
						print("    Checking in {}".format(jsline_parsed))
						for line in reading2:
							if line.find(imgline_parsed) != -1 or line.find(imgline_noext) != -1:
								found = True
								print("        Found! {}".format(line))
								break
					if found == True:
						break
			if found == False:
				print("    Not found.")
				unusedfile.write(imgline)

unusedfile.close()
reading.close()
reading2.close()
reading3.close()
print("All done. Check unused.txt for results.")