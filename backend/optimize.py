from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

def score_row(row):
    score = 0
    reasons = []

    if 'Deadline_Days' in row and pd.notna(row['Deadline_Days']):
        deadline = int(row['Deadline_Days'])
        score += deadline * 2
        if deadline <= 3:
            reasons.append("tight deadline")
        elif deadline <= 7:
            reasons.append("moderate deadline")

    if 'Estimated_Production_Time' in row and pd.notna(row['Estimated_Production_Time']):
        time = float(row['Estimated_Production_Time'])
        score += time * 1.5
        if time <= 10:
            reasons.append("short production time")
        elif time <= 20:
            reasons.append("moderate production time")

    if 'Complexity' in row:
        complexity_weight = {"Low": 1, "Medium": 2, "High": 3}
        complexity_score = complexity_weight.get(row['Complexity'], 2)
        score += complexity_score * 3
        if row['Complexity'] == "Low":
            reasons.append("low complexity")
        elif row['Complexity'] == "Medium":
            reasons.append("medium complexity")

    reason_str = "Prioritized due to " + ", ".join(reasons) + "." if reasons else "Standard priority."
    return score, reason_str

@app.route("/upload", methods=["POST"])
def upload():
    try:
        file = request.files['file']
        df = pd.read_csv(file)
        original_df = df.copy()

        if len(df) > 0:
            df['__score__'], df['AI_Reason'] = zip(*df.apply(score_row, axis=1))
            reordered_df = df.sort_values(by="__score__").drop(columns=["__score__"])
        else:
            reordered_df = df.copy()

        return jsonify({
            "original": original_df.to_dict(orient="records"),
            "predicted": reordered_df.to_dict(orient="records")
        })

    except Exception as e:
        print("❌ Backend error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000)
