use oracle;

create table oracle.demo (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL DEFAULT '' COMMENT 'key',
  `value` varchar(32) NOT NULL DEFAULT '' COMMENT 'value',
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  unique key idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'demo table';