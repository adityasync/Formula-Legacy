import csv
import json
import os
from collections import defaultdict, Counter

# Configuration
INPUT_DIR = 'F1'
OUTPUT_DIR = 'frontend/public/data'

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_csv(filename):
    path = os.path.join(INPUT_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def save_json(data, filename):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Generated {path}")

def generate_dnf_causes():
    print("Generating DNF causes...")
    status = {row['statusId']: row['status'] for row in load_csv('status.csv')}
    results = load_csv('results.csv')
    
    # Filter out finished (1) and disqualified (2) if needed, 
    # but usually we want to see mechanical failures vs accidents.
    # Status 1 is "Finished". 11, 12, 13, 14, ... are laps + variations of finished.
    # We'll valid non-finishing statuses.
    
    # Using specific IDs for common non-finishing statuses would be better, 
    # but for now let's just count all statuses that are NOT "Finished" or "+X Laps"
    
    dnf_counts = Counter()
    
    # Simple heuristic: Status ID 1 is Finished.
    # IDs usually represent distinct reasons.
    
    for row in results:
        sid = row['statusId']
        s_text = status.get(sid, "Unknown")
        
        # Exclude finishing statuses
        if s_text in ["Finished", "Disqualified"] or s_text.startswith("+"):
            continue
            
        dnf_counts[s_text] += 1
        
    # Format for Recharts
    data = [{"status": k, "count": v} for k, v in dnf_counts.most_common(10)]
    save_json(data, 'analytics_dnf.json')

def generate_pole_to_win():
    print("Generating Pole to Win...")
    results = load_csv('results.csv')
    drivers = {row['driverId']: f"{row['forename']} {row['surname']}" for row in load_csv('drivers.csv')}
    
    driver_stats = defaultdict(lambda: {'poles': 0, 'wins_from_pole': 0})
    
    for row in results:
        driver_id = row['driverId']
        grid = int(row['grid'])
        position = row['positionOrder'] # Final position
        
        if grid == 1:
            driver_stats[driver_id]['poles'] += 1
            if position == '1':
                driver_stats[driver_id]['wins_from_pole'] += 1
                
    # Filter for min 5 poles and format
    data = []
    for did, stats in driver_stats.items():
        if stats['poles'] >= 5:
            driver_name = drivers.get(did, "Unknown")
            conversion = (stats['wins_from_pole'] / stats['poles']) * 100
            data.append({
                "driver": driver_name,
                "poles": stats['poles'],
                "wins": stats['wins_from_pole'],
                "conversion_rate": round(conversion, 1)
            })
            
    data.sort(key=lambda x: x['conversion_rate'], reverse=True)
    save_json(data, 'analytics_pole_win.json')

def generate_head_to_head_data():
    print("Generating Head to Head data...")
    drivers_map = {d['driverId']: d for d in load_csv('drivers.csv')}
    results = load_csv('results.csv')
    
    # Aggregate stats per driver
    # Structure: { driverId: { name, code, nationality, wins, poles, podiums, total_points, races_entered, dnf_count } }
    
    stats = defaultdict(lambda: {
        'driverId': '', 'name': '', 'code': '', 'nationality': '',
        'wins': 0, 'poles': 0, 'podiums': 0, 'total_points': 0.0, 
        'races': 0, 'dnfs': 0, 'seasons': set()
    })
    
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    status_map = {s['statusId']: s['status'] for s in load_csv('status.csv')}
    
    for row in results:
        did = row['driverId']
        d_info = drivers_map.get(did)
        if not d_info: continue
        
        rid = row['raceId']
        year = races.get(rid)
        
        s = stats[did]
        s['driverId'] = did
        s['name'] = f"{d_info['forename']} {d_info['surname']}"
        s['code'] = d_info['code'] if d_info['code'] != '\\N' else d_info['surname'][:3].upper()
        s['nationality'] = d_info['nationality']
        s['races'] += 1
        if year: s['seasons'].add(year)
        
        # Points
        try:
            s['total_points'] += float(row['points'])
        except:
            pass
            
        # Position checks
        pos = row['positionOrder']
        if pos == '1':
            s['wins'] += 1
        if pos in ['1', '2', '3']:
            s['podiums'] += 1
            
        # Pole check
        if row['grid'] == '1':
            s['poles'] += 1
            
        # DNF check
        sid = row['statusId']
        status = status_map.get(sid, '')
        if status not in ['Finished', 'Disqualified'] and not status.startswith('+'):
            s['dnfs'] += 1

    # Convert to list and clean up
    final_list = []
    for did, data in stats.items():
        data['seasons'] = len(data['seasons'])
        data['total_points'] = round(data['total_points'], 1)
        data['win_rate'] = round((data['wins'] / data['races']) * 100, 1) if data['races'] > 0 else 0
        data['podium_rate'] = round((data['podiums'] / data['races']) * 100, 1) if data['races'] > 0 else 0
        data['pole_rate'] = round((data['poles'] / data['races']) * 100, 1) if data['races'] > 0 else 0
        data['dnf_rate'] = round((data['dnfs'] / data['races']) * 100, 1) if data['races'] > 0 else 0
        final_list.append(data)
        
    final_list.sort(key=lambda x: x['wins'], reverse=True)
    save_json(final_list, 'head_to_head.json')

def generate_grid_performance():
    print("Generating Grid Performance...")
    results = load_csv('results.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    
    # { driver_name: { gained: 0, races: 0 } }
    stats = defaultdict(lambda: {'gained': 0, 'races': 0})
    
    for row in results:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue # Limit to selected season for now (mocking 2023 focus)
        
        did = row['driverId']
        driver = drivers.get(did, "Unknown")
        
        grid = int(row['grid'])
        try:
            pos = int(row['positionOrder'])
        except:
            continue
            
        if grid > 0: # 0 often means pit lane start or error
            diff = grid - pos
            stats[driver]['gained'] += diff
            stats[driver]['races'] += 1
            
    data = []
    for driver, s in stats.items():
        if s['races'] > 10: # Filter for regulars
            avg = s['gained'] / s['races']
            data.append({
                "driver": driver,
                "avg_positions_gained": round(avg, 2)
            })
            
    data.sort(key=lambda x: x['avg_positions_gained'], reverse=True)
    save_json(data, 'analytics_grid.json')

def generate_fastest_laps():
    print("Generating Fastest Laps...")
    results = load_csv('results.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    
    # { driver_name: count }
    counts = Counter()
    
    for row in results:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue
        
        # 'rank' column in results.csv often denotes fastest lap rank (1 = fastest)
        rank = row.get('rank')
        if rank == '1':
            did = row['driverId']
            driver = drivers.get(did, "Unknown")
            counts[driver] += 1
            
    data = [{"driver": k, "fastest_laps": v} for k, v in counts.most_common(10)]
    save_json(data, 'analytics_fastest.json')

def generate_pit_stops():
    print("Generating Pit Stop Stats...")
    pit_stops = load_csv('pit_stops.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    
    # { driver_name: [times] }
    times = defaultdict(list)
    
    for row in pit_stops:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue
        
        did = row['driverId']
        driver = drivers.get(did, "Unknown")
        
        try:
            ms = int(row['milliseconds'])
            if ms < 40000: # Exclude outliers (e.g. repairs)
                 times[driver].append(ms / 1000.0)
        except:
            continue
            
    data = []
    for driver, t_list in times.items():
        if len(t_list) > 10:
            avg = sum(t_list) / len(t_list)
            data.append({
                "driver": driver,
                "avgPitSec": round(avg, 3)
            })
            
    data.sort(key=lambda x: x['avgPitSec'])
    save_json(data, 'analytics_pit.json')

def generate_championship_battle():
    print("Generating Championship Battle...")
    results = load_csv('results.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: {'year': r['year'], 'round': int(r['round']), 'name': r['name']} for r in load_csv('races.csv')}
    
    # { driver_name: { round: points } } - needs cumulative
    season_results = []
    
    for row in results:
        rid = row['raceId']
        r_info = races.get(rid)
        if not r_info or r_info['year'] != '2023': continue
        
        did = row['driverId']
        driver = drivers.get(did, "Unknown")
        points = float(row['points'])
        
        season_results.append({
            'driver': driver,
            'round': r_info['round'],
            'points': points,
            'race': r_info['name']
        })
        
    # Sort by round
    season_results.sort(key=lambda x: x['round'])
    
    # Calculate cumulative points
    driver_cumulative = defaultdict(float)
    final_data = [] # List of { driver, round, points, race }
    
    # Group by round to ensure we handle all drivers per round
    # But for simplicity, let's just emit each result with its new cumulative total
    # This assumes we process in round order (which we sorted)
    
    # To make line chart easy, Recharts likes [ {round: 1, ham: 25, ver: 18}, ... ] 
    # OR [ {driver: ham, data: [{round:1, pts:25}...]} ] which our frontend expects.
    # Frontend logic: 
    # champRes.data is list of { driver, round, points, race } (cumulative?)
    # Frontend does: champByDriver[driver].push({ round, points, race }) 
    # So we should provide CUMULATIVE points in the 'points' field.
    
    current_round = 0
    round_points = defaultdict(float) # for this specific round loop (not needed if we iterate list)
    
    for res in season_results:
        driver = res['driver']
        pts = res['points']
        driver_cumulative[driver] += pts
        
        final_data.append({
            "driver": driver,
            "round": res['round'],
            "points": driver_cumulative[driver],
            "race": res['race']
        })
        
    save_json(final_data, 'analytics_championship.json')

def generate_points_efficiency():
    print("Generating Points Efficiency...")
    # Mock efficiency (Points / Race)
    # Reuse functionality or just let users infer from Head-to-Head?
    # Let's generate a quick table.
    results = load_csv('results.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    constructors = {c['constructorId']: c['name'] for c in load_csv('constructors.csv')}
    
    stats = defaultdict(lambda: {'total_points': 0, 'races': 0, 'team': 'Unknown'})
    
    for row in results:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue
        
        did = row['driverId']
        driver = drivers.get(did, "Unknown")
        cid = row['constructorId']
        
        stats[driver]['total_points'] += float(row['points'])
        stats[driver]['races'] += 1
        stats[driver]['team'] = constructors.get(cid, "Unknown")
        
    data = []
    for driver, s in stats.items():
        if s['races'] > 0:
            avg = s['total_points'] / s['races']
            # Points rate: % of max points (26)
            rate = (avg / 26) * 100 
            data.append({
                "driver": driver,
                "team": s['team'],
                "races": s['races'],
                "total_points": s['total_points'],
                "points_per_race": round(avg, 2),
                "points_rate": round(rate, 1)
            })
            
    data.sort(key=lambda x: x['total_points'], reverse=True)
    save_json(data, 'analytics_points_efficiency.json')

def generate_qualifying_progression():
    print("Generating Qualifying Progression...")
    qualifying = load_csv('qualifying.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    constructors = {c['constructorId']: c['name'] for c in load_csv('constructors.csv')}

    # { driver: { sessions: 0, made_q2: 0, made_q3: 0, poles: 0 } }
    stats = defaultdict(lambda: {'sessions': 0, 'made_q2': 0, 'made_q3': 0, 'poles': 0, 'team': 'Unknown'})

    for row in qualifying:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue

        did = row['driverId']
        driver = drivers.get(did, "Unknown")
        cid = row['constructorId']

        s = stats[driver]
        s['sessions'] += 1
        s['team'] = constructors.get(cid, "Unknown")

        # Check Q2/Q3 presence
        # Dataset has q1, q2, q3 columns with times. If present, they made it.
        # Sometimes empty string or only in rare sets.
        # Actually checking pos is easier?
        # pos 1-15 made Q2 (in modern format), 1-10 made Q3.
        # Let's check times first.
        
        if row['q2'] and row['q2'].strip():
            s['made_q2'] += 1
        if row['q3'] and row['q3'].strip():
            s['made_q3'] += 1
        if row['position'] == '1':
            s['poles'] += 1
            
    data = []
    for driver, s in stats.items():
        if s['sessions'] > 0:
            q3_rate = (s['made_q3'] / s['sessions']) * 100
            data.append({
                "driver": driver,
                "team": s['team'],
                "sessions": s['sessions'],
                "made_q2": s['made_q2'],
                "made_q3": s['made_q3'],
                "q3_rate": round(q3_rate, 1),
                "poles": s['poles']
            })
            
    data.sort(key=lambda x: x['poles'], reverse=True)
    save_json(data, 'analytics_qualifying.json')
            
def generate_teammate_battles():
    print("Generating Teammate Battles...")
    # Simplified: Just grab constructor points and top 2 drivers per constructor
    results = load_csv('results.csv')
    drivers = {d['driverId']: f"{d['forename']} {d['surname']}" for d in load_csv('drivers.csv')}
    races = {r['raceId']: r['year'] for r in load_csv('races.csv')}
    constructors = {c['constructorId']: c['name'] for c in load_csv('constructors.csv')}
    
    # { team: { driver: wins } } - Head to Head in Race results
    team_stats = defaultdict(lambda: defaultdict(int))
    
    # Prepare data structure: need to compare teammates per race
    # { raceId: { teamId: { driverId: position } } }
    race_results = defaultdict(lambda: defaultdict(dict))
    
    for row in results:
        rid = row['raceId']
        year = races.get(rid)
        if year != '2023': continue
        
        cid = row['constructorId']
        did = row['driverId']
        try:
           pos = int(row['positionOrder'])
        except:
           pos = 999 
           
        race_results[rid][cid][did] = pos
        
    for rid, teams in race_results.items():
        for cid, drivers_pos in teams.items():
            if len(drivers_pos) == 2:
                d1, d2 = list(drivers_pos.keys())
                p1, p2 = drivers_pos[d1], drivers_pos[d2]
                
                team_name = constructors.get(cid, "Unknown")
                
                # Check who won
                if p1 < p2:
                    team_stats[team_name][drivers[d1]] += 1
                else:
                    team_stats[team_name][drivers[d2]] += 1
                    
    data = []
    for team, d_wins in team_stats.items():
        if len(d_wins) >= 2:
            d_names = list(d_wins.keys())
            data.append({
                "team": team,
                "driver1": d_names[0],
                "driver1_wins": d_wins[d_names[0]],
                "driver2": d_names[1],
                "driver2_wins": d_wins[d_names[1]]
            })
            
    save_json(data, 'analytics_teammate.json')

def main():
    try:
        generate_dnf_causes()
        generate_pole_to_win()
        generate_head_to_head_data()
        print("Success! Static data generated in frontend/public/data/")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
