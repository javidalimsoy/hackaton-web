from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
import pandas as pd
import joblib

# 🧪 Fake training data
train_data = pd.DataFrame([
    {"Size": "Small", "Material": "Plastic", "Complexity": "Low", "Add_Ons": 0, "Estimated_Production_Time": 10},
    {"Size": "Medium", "Material": "Metal", "Complexity": "Medium", "Add_Ons": 1, "Estimated_Production_Time": 20},
    {"Size": "Large", "Material": "Metal", "Complexity": "High", "Add_Ons": 2, "Estimated_Production_Time": 35},
    {"Size": "Small", "Material": "Wood", "Complexity": "Medium", "Add_Ons": 0, "Estimated_Production_Time": 15},
    {"Size": "Large", "Material": "Plastic", "Complexity": "Low", "Add_Ons": 1, "Estimated_Production_Time": 18},
    {"Size": "Medium", "Material": "Wood", "Complexity": "High", "Add_Ons": 3, "Estimated_Production_Time": 40},
    {"Size": "Small", "Material": "Metal", "Complexity": "High", "Add_Ons": 2, "Estimated_Production_Time": 32},
    {"Size": "Medium", "Material": "Plastic", "Complexity": "Medium", "Add_Ons": 1, "Estimated_Production_Time": 25},
])

X = train_data.drop(columns=["Estimated_Production_Time"])
y = train_data["Estimated_Production_Time"]

# 🔄 Preprocessing
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["Size", "Material", "Complexity"]),
    ("num", "passthrough", ["Add_Ons"])
])

# 🧠 Build + train model
model = make_pipeline(preprocessor, RandomForestRegressor(n_estimators=100, random_state=42))
model.fit(X, y)

# 💾 Save model to file
joblib.dump(model, "ai_estimator_model.joblib")
print("✅ Model trained and saved as ai_estimator_model.joblib")
