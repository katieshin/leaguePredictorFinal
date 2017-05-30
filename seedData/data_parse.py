import json
import csv 

output = []
i = 0
for file_num in range(1, 11):
    with open('matches' + str(file_num) + '.json', encoding='latin-1') as datafile:
        data = json.load(datafile)

    for match in data['matches']:
        output.append([])
        for pl in match['participants']:
            output[i].append(pl['championId'])
            output[i].append(pl['stats']['kills'])
            output[i].append(pl['stats']['deaths'])
            output[i].append(pl['stats']['assists'])
            output[i].append(pl['stats']['goldEarned'])
            
            if 'totalMinionsKilled' in pl['stats']:
                output[i].append(pl['stats']['totalMinionsKilled'])
            elif 'minionsKilled' in pl['stats']:
                output[i].append(pl['stats']['minionsKilled'])
            else:
                output[i].append("?")

            output[i].append(pl['stats']['neutralMinionsKilled'])
            output[i].append(pl['stats']['wardsPlaced'])
        
        if 'win' in match['participants'][0]['stats']:
            output[i].append(match['participants'][0]['stats']['win'])
        elif 'winner' in match['participants'][0]['stats']:
            output[i].append(match['participants'][0]['stats']['winner'])
        else:
            output[i].append("?")
        
        i += 1

with open("league.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(output)

print(output)
