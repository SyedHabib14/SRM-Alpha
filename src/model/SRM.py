import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

class SupplierResilienceModel:
    def __init__(self):
        self.risk_classifier = RandomForestClassifier(n_estimators=100)
        self.cost_predictor = RandomForestRegressor(n_estimators=100)
        self.label_encoders = {}
        self.scaler = StandardScaler()
        
    def preprocess_data(self, df):
        processed_df = df.copy()
        processed_df['price_volatility'] = processed_df.groupby('Supplier name')['Price'].transform('std')
        processed_df['avg_lead_time'] = processed_df.groupby('Supplier name')['Lead time'].transform('mean')
        processed_df['defect_rate_normalized'] = processed_df['Defect rates']
        categorical_columns = ['Location', 'Shipping carriers', 'Transportation modes', 'Routes']
        for col in categorical_columns:
            self.label_encoders[col] = LabelEncoder()
            processed_df[col] = self.label_encoders[col].fit_transform(processed_df[col])
        processed_df['Price'] = processed_df['Price'].fillna(processed_df['Price'].mean())
        return processed_df
    
    def generate_risk_features(self, df):
        risk_features = [
            'Lead time', 'Defect rates', 'price_volatility',
            'avg_lead_time', 'Manufacturing costs', 'Shipping costs',
            'Location', 'Transportation modes'
        ]
        return df[risk_features]
    
    def train_risk_model(self, df):
        processed_data = self.preprocess_data(df)
        X = self.generate_risk_features(processed_data)
        y = np.where(processed_data['Defect rates'] > 3, 'high',
              np.where(processed_data['Defect rates'] > 1, 'medium', 'low'))
        self.risk_classifier.fit(X, y)
    
    def predict_risk_levels(self, df):
        processed_data = self.preprocess_data(df)
        X = self.generate_risk_features(processed_data)
        return self.risk_classifier.predict(X)
    
    def generate_alerts(self, df, threshold_price=10, threshold_leadtime=20):
        alerts = []
        price_changes = df.groupby('Supplier name')['Price'].pct_change()
        price_alerts = df[price_changes > threshold_price/100]
        for _, row in price_alerts.iterrows():
            alerts.append({
                'type': 'price_increase',
                'supplier': row['Supplier name'],
                'increase': f"{price_changes[_]:.1%}",
                'timestamp': '2h ago'
            })
        leadtime_changes = df.groupby('Supplier name')['Lead time'].pct_change()
        delay_alerts = df[leadtime_changes > threshold_leadtime/100]
        for _, row in delay_alerts.iterrows():
            alerts.append({
                'type': 'delivery_delay',
                'supplier': row['Supplier name'],
                'delay': f"{leadtime_changes[_]:.1%}",
                'timestamp': '4h ago'
            })
        return alerts
    
    def calculate_analytics(self, df):
        processed_data = self.preprocess_data(df)
        risk_levels = self.predict_risk_levels(processed_data)
        analytics = {
                        'average_cost_increase': f"{processed_data['Manufacturing costs'].mean():.1%}",
            'high_risk_suppliers': len([r for r in risk_levels if r == 'high']),
            'active_alerts': len(self.generate_alerts(df))
        }
        return analytics

def main():
    df = pd.read_csv('E:\Rohail\SRM-Alpha\src\dataset\supply_chain_data.csv')
    model = SupplierResilienceModel()
    model.train_risk_model(df)
    risk_levels = model.predict_risk_levels(df)
    alerts = model.generate_alerts(df)
    analytics = model.calculate_analytics(df)
    print("Risk Levels:", pd.Series(risk_levels).value_counts())
    print("\nAlerts:", alerts[:3])
    print("\nAnalytics:", analytics)

if __name__ == "__main__":
    main()