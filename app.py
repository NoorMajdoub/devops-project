from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "devops_db"
}
@app.route("/")
def home():
    return "✅ Flask is running!"

@app.route("/api/subjects", methods=["GET"])
def get_subject():
    subject_name = request.args.get("name", "")

    if not subject_name:
        return jsonify({"error": "Missing subject name"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Fetch tasks for the given subject
        query = """
        SELECT id, subject_name, due_date, todo
        FROM devops_table
        WHERE subject_name LIKE %s
        """
        cursor.execute(query, (f"%{subject_name}%",))
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return jsonify({}), 404

        # Format data as expected by the frontend
        result = {
            "name": rows[0]["subject_name"],
            "tasks": [
                {
                    "id": row["id"],
                    "title": row["todo"],
                    "deadline": row["due_date"].isoformat(),  # Convert date to string
                    "priority": "medium"  # Static, or adjust based on business logic
                }
                for row in rows
            ]
        }

        return jsonify(result)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
