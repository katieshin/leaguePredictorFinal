import json
import csv

def construct_binary(champs):
    binstr = list("0" * 150)
    for champ in champs:
        binstr[champ] = "1"
    print(binstr)
    return ''.join(binstr)


output = []
i = 0
for file_num in range(1, 11):
    with open('matches' + str(file_num) + '.json', encoding='latin-1') as datafile:
        data = json.load(datafile)

    for match in data['matches']:
        output.append([])
        home = []
        away = []
        for j, pl in enumerate(match['participants']):
            print("j", j, "pl", pl)
            if j < 5:
                home.append(pl['championId'])
            else:
                away.append(pl['championId'])

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
        
        homeBin = construct_binary(home)
        awayBin = construct_binary(away)
        
        
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

