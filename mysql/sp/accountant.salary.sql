-- ═══════════════════════════════════════════════════════════════
-- SALARY STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- 1. SP: Get All Employee Salaries
-- ───────────────────────────────────────────────────────────────


CREATE PROCEDURE `sp_salary_get_all`()
BEGIN

  SELECT
    es.es_id                  AS salary_id,
    es.es_ua_id               AS user_id,
    ua.ua_full_name           AS employee_name,
    es.es_nspl_id             AS nspl_id,
    es.es_designation         AS designation,
    es.es_monthly_salary      AS monthly_salary,
    es.es_basic               AS basic,
    es.es_hra                 AS hra,
    es.es_conv_allow          AS conv_allowance,
    es.es_special_allow       AS special_allowance,
    es.es_gross_salary        AS gross_salary,
    es.es_pf_employee         AS pf_employee,
    es.es_esi_employee        AS esi_employee,
    es.es_ptax                AS professional_tax,
    es.es_total_deduction     AS total_deduction,
    es.es_net_salary          AS net_salary,
    es.es_bank_ac_no          AS bank_account_no,
    es.es_ifsc_code           AS ifsc_code,
    es.es_effective_from      AS effective_from,
    es.es_isactive            AS is_active,
    es.es_created_at          AS created_at,
    es.es_updated_at          AS updated_at

  FROM tbl_emp_salary es
  INNER JOIN tbl_user_auth ua
    ON ua.ua_id = es.es_ua_id
  WHERE es.es_isactive = 1
  ORDER BY es.es_id;

END;




-- ───────────────────────────────────────────────────────────────
-- 2. SP: Get Single Employee Salary by es_id
-- ───────────────────────────────────────────────────────────────


CREATE PROCEDURE `sp_salary_get_by_id`(
  IN p_es_id INT
)
BEGIN

  SELECT
    es.es_id                  AS salary_id,
    es.es_ua_id               AS user_id,
    ua.ua_full_name           AS employee_name,
    es.es_nspl_id             AS nspl_id,
    es.es_designation         AS designation,
    es.es_monthly_salary      AS monthly_salary,
    es.es_basic               AS basic,
    es.es_hra                 AS hra,
    es.es_conv_allow          AS conv_allowance,
    es.es_special_allow       AS special_allowance,
    es.es_gross_salary        AS gross_salary,
    es.es_pf_employee         AS pf_employee,
    es.es_esi_employee        AS esi_employee,
    es.es_ptax                AS professional_tax,
    es.es_total_deduction     AS total_deduction,
    es.es_net_salary          AS net_salary,
    es.es_bank_ac_no          AS bank_account_no,
    es.es_ifsc_code           AS ifsc_code,
    es.es_effective_from      AS effective_from,
    es.es_isactive            AS is_active,
    es.es_created_at          AS created_at,
    es.es_updated_at          AS updated_at

  FROM tbl_emp_salary es
  INNER JOIN tbl_user_auth ua
    ON ua.ua_id = es.es_ua_id
  WHERE es.es_id = p_es_id AND es.es_isactive = 1;

END;




-- ───────────────────────────────────────────────────────────────
-- 3. SP: Update Employee Salary
--    Auto-recalculates gross, deductions, net from components
-- ───────────────────────────────────────────────────────────────


CREATE PROCEDURE `sp_salary_update`(
  IN  p_es_id             INT,
  IN  p_es_designation    VARCHAR(200),
  IN  p_es_monthly_salary DECIMAL(10,2),
  IN  p_es_basic          DECIMAL(10,2),
  IN  p_es_hra            DECIMAL(10,2),
  IN  p_es_conv_allow     DECIMAL(10,2),
  IN  p_es_special_allow  DECIMAL(10,2),
  IN  p_es_pf_employee    DECIMAL(10,2),
  IN  p_es_esi_employee   DECIMAL(10,2),
  IN  p_es_ptax           DECIMAL(10,2),
  IN  p_es_bank_ac_no     VARCHAR(50),
  IN  p_es_ifsc_code      VARCHAR(20),
  IN  p_es_effective_from DATE,
  OUT p_message           VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists        INT DEFAULT 0;
  DECLARE v_gross         DECIMAL(10,2) DEFAULT 0.00;
  DECLARE v_total_deduct  DECIMAL(10,2) DEFAULT 0.00;
  DECLARE v_net           DECIMAL(10,2) DEFAULT 0.00;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
  END;

  -- Check record exists
  SELECT COUNT(*) INTO v_exists
  FROM tbl_emp_salary
  WHERE es_id = p_es_id AND es_isactive = 1;

  IF v_exists = 0 THEN
    SET p_message = CONCAT('ERROR: No active salary record found for ID ', p_es_id, '.');
    LEAVE proc_label;
  END IF;

  -- Auto-calculate gross, total deduction, net salary
  SET v_gross        = p_es_basic + p_es_hra + p_es_conv_allow + p_es_special_allow;
  SET v_total_deduct = p_es_pf_employee + p_es_esi_employee + p_es_ptax;
  SET v_net          = v_gross - v_total_deduct;

  START TRANSACTION;

    UPDATE tbl_emp_salary SET
      es_designation    = p_es_designation,
      es_monthly_salary = p_es_monthly_salary,
      es_basic          = p_es_basic,
      es_hra            = p_es_hra,
      es_conv_allow     = p_es_conv_allow,
      es_special_allow  = p_es_special_allow,
      es_gross_salary   = v_gross,
      es_pf_employee    = p_es_pf_employee,
      es_esi_employee   = p_es_esi_employee,
      es_ptax           = p_es_ptax,
      es_total_deduction = v_total_deduct,
      es_net_salary     = v_net,
      es_bank_ac_no     = p_es_bank_ac_no,
      es_ifsc_code      = p_es_ifsc_code,
      es_effective_from = p_es_effective_from
    WHERE es_id = p_es_id;

    SET p_message = CONCAT('SUCCESS: Salary updated for ID ', p_es_id, '.');

  COMMIT;

END proc_label;




-- ───────────────────────────────────────────────────────────────
-- 4. SP: Get Salary Records (from tbl_salary_records)
--    p_ua_id = 0/NULL → all employees
--    p_month = 0/NULL → all months
-- ───────────────────────────────────────────────────────────────


CREATE PROCEDURE `sp_salary_records_get`(
  IN p_ua_id  INT,
  IN p_month  TINYINT,
  IN p_year   INT
)
BEGIN

  SELECT
    sr.sr_id                      AS record_id,
    sr.sr_ua_id                   AS user_id,
    ua.ua_full_name               AS employee_name,
    sr.sr_nspl_id                 AS nspl_id,
    sr.sr_designation             AS designation,
    DATE_FORMAT(sr.sr_salary_month, '%b %Y') AS salary_month,
    sr.sr_basic                   AS basic,
    sr.sr_hra                     AS hra,
    sr.sr_conv_allow              AS conv_allowance,
    sr.sr_special_allow           AS special_allowance,
    sr.sr_gross_salary            AS gross_salary,
    sr.sr_pf_employee             AS pf_employee,
    sr.sr_esi_employee            AS esi_employee,
    sr.sr_ptax                    AS professional_tax,
    sr.sr_lop_days                AS lop_days,
    sr.sr_excess_leave_deduction  AS excess_leave_deduction,
    sr.sr_total_deduction         AS total_deduction,
    sr.sr_net_salary              AS net_salary,
    sr.sr_working_days            AS working_days,
    sr.sr_present_days            AS present_days,
    sr.sr_bank_ac_no              AS bank_account_no,
    sr.sr_ifsc_code               AS ifsc_code,
    sr.sr_payment_date            AS payment_date,
    sr.sr_payment_mode            AS payment_mode,
    sr.sr_status                  AS status,
    sr.sr_remarks                 AS remarks,
    sr.sr_created_at              AS created_at

  FROM tbl_salary_records sr
  INNER JOIN tbl_user_auth ua
    ON ua.ua_id = sr.sr_ua_id

  WHERE
    YEAR(sr.sr_salary_month)  = p_year
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR sr.sr_ua_id = p_ua_id)
    AND (p_month IS NULL OR p_month = 0 OR MONTH(sr.sr_salary_month) = p_month)

  ORDER BY sr.sr_salary_month DESC, sr.sr_ua_id;

END;

