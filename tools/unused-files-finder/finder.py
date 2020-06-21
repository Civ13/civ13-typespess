import os
from pathlib import Path
from shutil import copyfile

path ="..\\..\\" # gets the base folder to search in
print("Listing files...")
with open("imglist.txt", "w") as writing:
	with open("jslist.txt", "w") as writing2:
		for root, dirs, files in os.walk(path): # checks all files and folders in the base folder
			for file in files:
				filesp = file.replace("\n","") # removes the paragraph at the end of the string
				if(file.endswith(".png") or file.endswith(".gif") or file.endswith(".jpg") or file.endswith(".ogg")):
					# if it has one of the extensions, split it so we get the filename without dirs
					filesp = file.split("\\")
					writing.write(filesp[len(filesp)-1]+"\n") # return the last value of the splitted array and write to the file
				#moving on to the code file listing...
				elif(file.endswith(".js") or file.endswith(".ts") or file.endswith(".coffee")): #search code files
					filesp = str(root)+"\\"+str(file) # get the absolute directory
					if filesp.find("node_modules") == -1 and filesp.find("tools") == -1: #exclude the dependency folders
						writing2.write(filesp+"\n")
writing.close()
writing2.close()

#all listed, now lets pair
print("Finished listing the files.")
print("Checking files...")
with open("unused.txt","w") as unusedfile: # this is where we will list all the orphaned files
	with open("imglist.txt", "r") as reading3:
		for imgline in reading3:
			found = False
			imgline_parsed = imgline.replace("\n","") # remove the paragraph
			imgline_noext = imgline_parsed.split(".")[0] #lets find it without the extension too
			print("Checking {}".format(imgline_parsed))
			with open("jslist.txt", "r") as reading:
				for jsline in reading:
					jsline_parsed = jsline.replace("\n","")
					with open(jsline_parsed, "r", encoding="utf-8") as reading2: # opening the files in jslist.txt...
						print("    Checking in {}".format(jsline_parsed))
						for line in reading2: # checking each line
							if line.find(imgline_parsed) != -1 or line.find(imgline_noext) != -1: #if either of the img names found
								found = True
								print("        Found! {}".format(line)) # break out of the condition (no need to search the rest of the files)
								break
					if found == True:
						break
			if found == False:
				print("    Not found.")
				#if not found, write to list
				unusedfile.write(imgline)

unusedfile.close()
reading.close()
reading2.close()
reading3.close()
print("All done. Check unused.txt for results.")