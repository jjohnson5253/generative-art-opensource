import os

directory = './bear_rugs_1k_sample'

MAX_FILE_SIZE_BYTES = 10000000; # 10mb

largestFileSize = 0 # keep track of biggest file
largestFile = ''

print()
print("Max byte size: " + str(MAX_FILE_SIZE_BYTES))
print()
print("###################################")
print("Files over max byte size:")

for filename in os.listdir(directory):
	# get path to file
	filepath = os.path.join(directory, filename)

	# get file size
	bytes = os.path.getsize(filepath)

	# check file size and print if over
	if (bytes > MAX_FILE_SIZE_BYTES):
		print(filename)

	# keep track of largest file
	if (bytes > largestFileSize):
		largestFileSize = bytes;
		largestFile = filename

print("###################################")
print()
print("Largest file: " + str(largestFile) + " size: " + str(largestFileSize))