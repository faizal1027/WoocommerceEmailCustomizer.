UPDATE wp_wetc_email_templates
SET json_data = '[]'
WHERE id IN (
    SELECT id FROM (
        SELECT id FROM wp_wetc_email_templates
    ) AS temp
);
