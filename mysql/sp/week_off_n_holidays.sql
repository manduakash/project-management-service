-- ═══════════════════════════════════════════════════════════════
-- WEEK OFFS STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- 1. SP: Get All Week Offs
--    p_month = 0/NULL → all months
--    p_year  = required
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_weekoff_get_all` $$

CREATE PROCEDURE `sp_weekoff_get_all`(
  IN p_month  TINYINT,
  IN p_year   INT
)
BEGIN

  SELECT
    wo.id                             AS weekoff_id,
    wo.off_date                       AS off_date,
    DATE_FORMAT(wo.off_date, '%W')    AS day_name,
    DATE_FORMAT(wo.off_date, '%b %Y') AS month_label,
    MONTH(wo.off_date)                AS month_number,
    YEAR(wo.off_date)                 AS year

  FROM week_offs wo

  WHERE YEAR(wo.off_date)  = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(wo.off_date) = p_month)

  ORDER BY wo.off_date;

END $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 2. SP: Get Week Off by ID
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_weekoff_get_by_id` $$

CREATE PROCEDURE `sp_weekoff_get_by_id`(
  IN p_id INT
)
BEGIN

  SELECT
    wo.id                             AS weekoff_id,
    wo.off_date                       AS off_date,
    DATE_FORMAT(wo.off_date, '%W')    AS day_name,
    DATE_FORMAT(wo.off_date, '%b %Y') AS month_label,
    MONTH(wo.off_date)                AS month_number,
    YEAR(wo.off_date)                 AS year

  FROM week_offs wo
  WHERE wo.id = p_id;

END $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 3. SP: Insert Week Off
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_weekoff_insert` $$

CREATE PROCEDURE `sp_weekoff_insert`(
  IN  p_off_date  DATE,
  OUT p_new_id    INT,
  OUT p_message   VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
    SET p_new_id = 0;
  END;

  -- Check duplicate
  SELECT COUNT(*) INTO v_exists
  FROM week_offs
  WHERE off_date = p_off_date;

  IF v_exists > 0 THEN
    SET p_new_id  = 0;
    SET p_message = CONCAT('ERROR: Week off already exists for ', p_off_date, '.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;

    INSERT INTO week_offs (off_date) VALUES (p_off_date);
    SET p_new_id  = LAST_INSERT_ID();
    SET p_message = CONCAT('SUCCESS: Week off added for ', DATE_FORMAT(p_off_date, '%d %b %Y'), '.');

  COMMIT;

END proc_label $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 4. SP: Update Week Off
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_weekoff_update` $$

CREATE PROCEDURE `sp_weekoff_update`(
  IN  p_id        INT,
  IN  p_off_date  DATE,
  OUT p_message   VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists      INT DEFAULT 0;
  DECLARE v_dup_exists  INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
  END;

  SELECT COUNT(*) INTO v_exists FROM week_offs WHERE id = p_id;
  IF v_exists = 0 THEN
    SET p_message = CONCAT('ERROR: Week off ID ', p_id, ' not found.');
    LEAVE proc_label;
  END IF;

  SELECT COUNT(*) INTO v_dup_exists FROM week_offs WHERE off_date = p_off_date AND id != p_id;
  IF v_dup_exists > 0 THEN
    SET p_message = CONCAT('ERROR: Week off already exists for ', p_off_date, '.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;
    UPDATE week_offs SET off_date = p_off_date WHERE id = p_id;
    SET p_message = CONCAT('SUCCESS: Week off updated to ', DATE_FORMAT(p_off_date, '%d %b %Y'), '.');
  COMMIT;

END proc_label $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 5. SP: Delete Week Off
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_weekoff_delete` $$

CREATE PROCEDURE `sp_weekoff_delete`(
  IN  p_id      INT,
  OUT p_message VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
  END;

  SELECT COUNT(*) INTO v_exists FROM week_offs WHERE id = p_id;
  IF v_exists = 0 THEN
    SET p_message = CONCAT('ERROR: Week off ID ', p_id, ' not found.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;
    DELETE FROM week_offs WHERE id = p_id;
    SET p_message = CONCAT('SUCCESS: Week off ID ', p_id, ' deleted.');
  COMMIT;

END proc_label $$

DELIMITER ;


-- ═══════════════════════════════════════════════════════════════
-- HOLIDAYS STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- 6. SP: Get All Holidays
--    p_month = 0/NULL → all months
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_holiday_get_all` $$

CREATE PROCEDURE `sp_holiday_get_all`(
  IN p_month  TINYINT,
  IN p_year   INT
)
BEGIN

  SELECT
    hm.hm_id                            AS holiday_id,
    hm.hm_name                          AS holiday_name,
    hm.hm_date                          AS holiday_date,
    DATE_FORMAT(hm.hm_date, '%W')       AS day_name,
    DATE_FORMAT(hm.hm_date, '%b %Y')    AS month_label,
    MONTH(hm.hm_date)                   AS month_number,
    hm.hm_year                          AS year,
    hm.hm_isactive                      AS is_active

  FROM tbl_holiday_mstr hm

  WHERE hm.hm_isactive = 1
    AND hm.hm_year     = p_year
    AND (p_month IS NULL OR p_month = 0 OR MONTH(hm.hm_date) = p_month)

  ORDER BY hm.hm_date;

END $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 7. SP: Get Holiday by ID
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_holiday_get_by_id` $$

CREATE PROCEDURE `sp_holiday_get_by_id`(
  IN p_id INT
)
BEGIN

  SELECT
    hm.hm_id                            AS holiday_id,
    hm.hm_name                          AS holiday_name,
    hm.hm_date                          AS holiday_date,
    DATE_FORMAT(hm.hm_date, '%W')       AS day_name,
    DATE_FORMAT(hm.hm_date, '%b %Y')    AS month_label,
    MONTH(hm.hm_date)                   AS month_number,
    hm.hm_year                          AS year,
    hm.hm_isactive                      AS is_active

  FROM tbl_holiday_mstr hm
  WHERE hm.hm_id = p_id AND hm.hm_isactive = 1;

END $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 8. SP: Insert Holiday
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_holiday_insert` $$

CREATE PROCEDURE `sp_holiday_insert`(
  IN  p_hm_name   VARCHAR(100),
  IN  p_hm_date   DATE,
  OUT p_new_id    INT,
  OUT p_message   VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
    SET p_new_id = 0;
  END;

  SELECT COUNT(*) INTO v_exists
  FROM tbl_holiday_mstr
  WHERE hm_date = p_hm_date AND hm_isactive = 1;

  IF v_exists > 0 THEN
    SET p_new_id  = 0;
    SET p_message = CONCAT('ERROR: Holiday already exists for ', p_hm_date, '.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;

    INSERT INTO tbl_holiday_mstr (hm_name, hm_date, hm_year, hm_isactive)
    VALUES (p_hm_name, p_hm_date, YEAR(p_hm_date), 1);

    SET p_new_id  = LAST_INSERT_ID();
    SET p_message = CONCAT('SUCCESS: Holiday "', p_hm_name, '" added for ', DATE_FORMAT(p_hm_date, '%d %b %Y'), '.');

  COMMIT;

END proc_label $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 9. SP: Update Holiday
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_holiday_update` $$

CREATE PROCEDURE `sp_holiday_update`(
  IN  p_hm_id     INT,
  IN  p_hm_name   VARCHAR(100),
  IN  p_hm_date   DATE,
  OUT p_message   VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists     INT DEFAULT 0;
  DECLARE v_dup_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
  END;

  SELECT COUNT(*) INTO v_exists FROM tbl_holiday_mstr WHERE hm_id = p_hm_id AND hm_isactive = 1;
  IF v_exists = 0 THEN
    SET p_message = CONCAT('ERROR: Holiday ID ', p_hm_id, ' not found.');
    LEAVE proc_label;
  END IF;

  SELECT COUNT(*) INTO v_dup_exists
  FROM tbl_holiday_mstr
  WHERE hm_date = p_hm_date AND hm_id != p_hm_id AND hm_isactive = 1;

  IF v_dup_exists > 0 THEN
    SET p_message = CONCAT('ERROR: Another holiday already exists for ', p_hm_date, '.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;
    UPDATE tbl_holiday_mstr
    SET hm_name = p_hm_name,
        hm_date = p_hm_date,
        hm_year = YEAR(p_hm_date)
    WHERE hm_id = p_hm_id;

    SET p_message = CONCAT('SUCCESS: Holiday updated to "', p_hm_name, '" on ', DATE_FORMAT(p_hm_date, '%d %b %Y'), '.');
  COMMIT;

END proc_label $$

DELIMITER ;


-- ───────────────────────────────────────────────────────────────
-- 10. SP: Delete Holiday (soft delete)
-- ───────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_holiday_delete` $$

CREATE PROCEDURE `sp_holiday_delete`(
  IN  p_hm_id   INT,
  OUT p_message VARCHAR(500)
)
proc_label: BEGIN

  DECLARE v_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    GET DIAGNOSTICS CONDITION 1 p_message = MESSAGE_TEXT;
  END;

  SELECT COUNT(*) INTO v_exists FROM tbl_holiday_mstr WHERE hm_id = p_hm_id AND hm_isactive = 1;
  IF v_exists = 0 THEN
    SET p_message = CONCAT('ERROR: Holiday ID ', p_hm_id, ' not found.');
    LEAVE proc_label;
  END IF;

  START TRANSACTION;
    UPDATE tbl_holiday_mstr SET hm_isactive = 0 WHERE hm_id = p_hm_id;
    SET p_message = CONCAT('SUCCESS: Holiday ID ', p_hm_id, ' deleted.');
  COMMIT;

END proc_label $$

DELIMITER ;