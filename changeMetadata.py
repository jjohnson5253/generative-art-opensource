# https://stackoverflow.com/q/17140886/

import os

directory = './output'
cnt=0

# loop through files
for filename in os.listdir(directory):
	# only alter metadata
	if filename.endswith((".json")):
		cnt=cnt+1
		#print(filename)

		filepath = os.path.join(directory, filename)

		# read in metadata
		with open(filepath, 'r') as file:
			metadata = file.read()
		
		# Replace whatever with whatever
		metadata = metadata.replace('"description":"Bear rugs not drugs"', '"description":"solana blockchain"')

		# Write the file out again
		with open(filepath, 'w') as file:
			file.write(metadata)

# print num of files changed
print(cnt)