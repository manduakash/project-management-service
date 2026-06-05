-- ═══════════════════════════════════════════════════════════════
-- DASHBOARD STORED PROCEDURES
-- p_ua_id : 0 or NULL = all employees
-- p_month : 0 or NULL = all months of the year
-- p_year  : e.g. 2026
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- 1. SP: Top Summary Cards
-- ───────────────────────────────────────────────────────────────

DROP PROCEDURE IF EXISTS `sp_dashboard_summary` $$

CREATE PROCEDURE `sp_dashboard_summary`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,
    es.es_designation                                 AS designation,

    COALESCE(SUM(CASE WHEN at.at_status = 'present'                                              THEN 1 ELSE 0 END), 0) AS total_present,
    COALESCE(SUM(CASE WHEN at.at_status IN ('casual_leave','privileged_leave','sick_leave')       THEN 1 ELSE 0 END), 0) AS total_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'week_off'                                             THEN 1 ELSE 0 END), 0) AS weeks_off,
    COALESCE(SUM(CASE WHEN at.at_status = 'holiday'                                              THEN 1 ELSE 0 END), 0) AS holidays,
    COALESCE(SUM(CASE WHEN at.at_status = 'half_day'                                             THEN 1 ELSE 0 END), 0) AS half_days,
    COALESCE(SUM(CASE WHEN at.at_status = 'absent'                                               THEN 1 ELSE 0 END), 0) AS absent,
    COALESCE(SUM(CASE WHEN at.at_status = 'casual_leave'                                         THEN 1 ELSE 0 END), 0) AS casual_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'privileged_leave'                                     THEN 1 ELSE 0 END), 0) AS privileged_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'sick_leave'                                           THEN 1 ELSE 0 END), 0) AS sick_leave

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_attendance at
    ON  at.at_ua_id          = ua.ua_id
    AND YEAR(at.at_date)     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(at.at_date) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  GROUP BY ua.ua_id, employee_name, es.es_designation
  ORDER BY ua.ua_id;

END;


-- ───────────────────────────────────────────────────────────────
-- 2. SP: Attendance Report (Bar Chart)
-- ───────────────────────────────────────────────────────────────

DROP PROCEDURE IF EXISTS `sp_dashboard_attendance_report` $$

CREATE PROCEDURE `sp_dashboard_attendance_report`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,

    -- If all months: group by month, else single month label
    CASE
      WHEN (p_month IS NULL OR p_month = 0)
        THEN DATE_FORMAT(at.at_date, '%b %Y')
      ELSE DATE_FORMAT(STR_TO_DATE(CONCAT(p_year,'-',p_month,'-01'),'%Y-%m-%d'), '%b %Y')
    END                                               AS month_label,

    MONTH(at.at_date)                                 AS month_number,

    COALESCE(SUM(CASE WHEN at.at_status = 'present'          THEN 1 ELSE 0 END), 0) AS present,
    COALESCE(SUM(CASE WHEN at.at_status = 'absent'           THEN 1 ELSE 0 END), 0) AS absent,
    COALESCE(SUM(CASE WHEN at.at_status = 'half_day'         THEN 1 ELSE 0 END), 0) AS half_day,
    COALESCE(SUM(CASE WHEN at.at_status = 'privileged_leave' THEN 1 ELSE 0 END), 0) AS privileged_leave

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_attendance at
    ON  at.at_ua_id          = ua.ua_id
    AND YEAR(at.at_date)     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(at.at_date) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  GROUP BY
    ua.ua_id,
    employee_name,
    month_label,
    MONTH(at.at_date)

  ORDER BY ua.ua_id, MONTH(at.at_date);

END;


-- ───────────────────────────────────────────────────────────────
-- 3. SP: Discipline (Donut Chart)
-- ───────────────────────────────────────────────────────────────

DROP PROCEDURE IF EXISTS `sp_dashboard_discipline` $$

CREATE PROCEDURE `sp_dashboard_discipline`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,

    CASE
      WHEN (p_month IS NULL OR p_month = 0) THEN CONCAT(p_year, ' (All Months)')
      ELSE DATE_FORMAT(STR_TO_DATE(CONCAT(p_year,'-',p_month,'-01'),'%Y-%m-%d'), '%b %Y')
    END                                               AS period_label,

    COALESCE(SUM(CASE WHEN at.at_is_late = 0 AND at.at_status = 'present' THEN 1 ELSE 0 END), 0) AS discipline_permissible,
    COALESCE(SUM(CASE WHEN at.at_is_late = 1                               THEN 1 ELSE 0 END), 0) AS discipline_breach,
    COALESCE(SUM(CASE WHEN at.at_status = 'absent'                         THEN 1 ELSE 0 END), 0) AS absent_count,
    COALESCE(SUM(CASE WHEN at.at_status IN ('casual_leave','privileged_leave','sick_leave') THEN 1 ELSE 0 END), 0) AS on_leave,

    COALESCE(ROUND(SUM(CASE WHEN at.at_is_late = 0 AND at.at_status = 'present' THEN 1 ELSE 0 END) / NULLIF(COUNT(at.at_id), 0) * 100, 0), 0) AS permissible_pct,
    COALESCE(ROUND(SUM(CASE WHEN at.at_is_late = 1                               THEN 1 ELSE 0 END) / NULLIF(COUNT(at.at_id), 0) * 100, 0), 0) AS breach_pct,
    COALESCE(ROUND(SUM(CASE WHEN at.at_status = 'absent'                         THEN 1 ELSE 0 END) / NULLIF(COUNT(at.at_id), 0) * 100, 0), 0) AS absent_pct,
    COALESCE(ROUND(SUM(CASE WHEN at.at_status IN ('casual_leave','privileged_leave','sick_leave') THEN 1 ELSE 0 END) / NULLIF(COUNT(at.at_id), 0) * 100, 0), 0) AS leave_pct

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_attendance at
    ON  at.at_ua_id          = ua.ua_id
    AND YEAR(at.at_date)     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(at.at_date) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  GROUP BY ua.ua_id, employee_name, period_label
  ORDER BY ua.ua_id;

END;


-- ───────────────────────────────────────────────────────────────
-- 4. SP: Salary Card
-- ───────────────────────────────────────────────────────────────

DROP PROCEDURE IF EXISTS `sp_dashboard_salary` $$

CREATE PROCEDURE `sp_dashboard_salary`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,
    es.es_designation                                 AS designation,
    DATE_FORMAT(sr.sr_salary_month, '%b %Y')          AS salary_month,
    sr.sr_gross_salary                                AS gross_salary,
    sr.sr_pf_employee                                 AS pf_deduction,
    sr.sr_esi_employee                                AS esi_deduction,
    sr.sr_ptax                                        AS professional_tax,
    sr.sr_lop_days                                    AS lop_days,
    sr.sr_excess_leave_deduction                      AS excess_leave_deduction,
    sr.sr_total_deduction                             AS total_deduction,
    sr.sr_net_salary                                  AS net_salary,
    sr.sr_status                                      AS payment_status,
    sr.sr_payment_date                                AS payment_date,

    -- Aggregates (useful when p_month = 0)
    SUM(sr.sr_gross_salary)    OVER (PARTITION BY ua.ua_id) AS yearly_gross,
    SUM(sr.sr_total_deduction) OVER (PARTITION BY ua.ua_id) AS yearly_deduction,
    SUM(sr.sr_net_salary)      OVER (PARTITION BY ua.ua_id) AS yearly_net

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_salary_records sr
    ON  sr.sr_ua_id               = ua.ua_id
    AND YEAR(sr.sr_salary_month)  = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(sr.sr_salary_month) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  ORDER BY ua.ua_id, sr.sr_salary_month;

END;


-- ───────────────────────────────────────────────────────────────
-- 5. SP: Leaves Donut Chart
-- ───────────────────────────────────────────────────────────────

DROP PROCEDURE IF EXISTS `sp_dashboard_leaves` $$

CREATE PROCEDURE `sp_dashboard_leaves`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,

    CASE
      WHEN (p_month IS NULL OR p_month = 0) THEN CONCAT(p_year, ' (All Months)')
      ELSE DATE_FORMAT(STR_TO_DATE(CONCAT(p_year,'-',p_month,'-01'),'%Y-%m-%d'), '%b %Y')
    END                                               AS period_label,

    COALESCE(SUM(CASE WHEN at.at_status = 'casual_leave'     THEN 1 ELSE 0 END), 0) AS casual_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'privileged_leave' THEN 1 ELSE 0 END), 0) AS privileged_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'sick_leave'       THEN 1 ELSE 0 END), 0) AS sick_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'half_day'         THEN 1 ELSE 0 END), 0) AS half_day,
    COALESCE(SUM(CASE WHEN at.at_status IN (
                          'casual_leave','privileged_leave','sick_leave','half_day'
                       ) THEN 1 ELSE 0 END), 0)                                      AS total_leaves,

    COALESCE(ROUND(
      SUM(CASE WHEN at.at_status IN ('casual_leave','privileged_leave','sick_leave','half_day') THEN 1 ELSE 0 END)
      / NULLIF(COUNT(at.at_id), 0) * 100, 0
    ), 0) AS leave_pct,

    COALESCE(ROUND(
      SUM(CASE WHEN at.at_status NOT IN ('casual_leave','privileged_leave','sick_leave','half_day') THEN 1 ELSE 0 END)
      / NULLIF(COUNT(at.at_id), 0) * 100, 0
    ), 0) AS non_leave_pct

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_attendance at
    ON  at.at_ua_id          = ua.ua_id
    AND YEAR(at.at_date)     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(at.at_date) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  GROUP BY ua.ua_id, employee_name, period_label
  ORDER BY ua.ua_id;

END;


-- ───────────────────────────────────────────────────────────────
-- 6. SP: Working Chart (Stacked Bar)
-- ───────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS `sp_dashboard_working` $$

CREATE PROCEDURE `sp_dashboard_working`(
  IN  p_ua_id   INT,
  IN  p_month   TINYINT,
  IN  p_year    INT
)
BEGIN

  SELECT
    ua.ua_id                                          AS employee_id,
    CONCAT(ua.ua_first_name, ' ', ua.ua_last_name)   AS employee_name,
    DATE_FORMAT(at.at_date, '%b %Y')                  AS month_label,
    MONTH(at.at_date)                                 AS month_number,

    DAY(LAST_DAY(at.at_date))                         AS total_days,

    COALESCE(SUM(CASE WHEN at.at_status = 'present'          THEN 1 ELSE 0 END), 0) AS working_present,
    COALESCE(SUM(CASE WHEN at.at_status = 'absent'           THEN 1 ELSE 0 END), 0) AS working_absent,
    COALESCE(SUM(CASE WHEN at.at_status = 'half_day'         THEN 1 ELSE 0 END), 0) AS working_half_day,
    COALESCE(SUM(CASE WHEN at.at_status IN (
                          'casual_leave','privileged_leave','sick_leave'
                       ) THEN 1 ELSE 0 END), 0)                                      AS working_on_leave,
    COALESCE(SUM(CASE WHEN at.at_status = 'week_off'         THEN 1 ELSE 0 END), 0) AS working_week_off,
    COALESCE(SUM(CASE WHEN at.at_status = 'holiday'          THEN 1 ELSE 0 END), 0) AS working_holiday

  FROM tbl_user_auth ua
  INNER JOIN tbl_emp_salary es
    ON es.es_ua_id = ua.ua_id AND es.es_isactive = 1
  LEFT JOIN tbl_attendance at
    ON  at.at_ua_id          = ua.ua_id
    AND YEAR(at.at_date)     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(at.at_date) = p_month)

  WHERE ua.ua_isactive = 1
    AND (p_ua_id IS NULL OR p_ua_id = 0 OR ua.ua_id = p_ua_id)

  GROUP BY
    ua.ua_id,
    employee_name,
    DATE_FORMAT(at.at_date, '%b %Y'),
    MONTH(at.at_date),
    DAY(LAST_DAY(at.at_date))

  ORDER BY ua.ua_id, MONTH(at.at_date);

END;