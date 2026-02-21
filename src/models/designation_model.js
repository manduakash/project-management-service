import pool from "../config/db.js";

class DesignationModel {

  static async get_all_designations() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getAllDesignationDetails()"
      );

      // Stored procedure returns nested array; first element contains the rows
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }
}

export default DesignationModel;
