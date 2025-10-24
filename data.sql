/*
 Navicat Premium Data Transfer

 Source Server         : 乡村基础教育
 Source Server Type    : MySQL
 Source Server Version : 80034 (8.0.34)
 Source Host           : localhost:3306
 Source Schema         : data

 Target Server Type    : MySQL
 Target Server Version : 80034 (8.0.34)
 File Encoding         : 65001

 Date: 11/10/2025 16:03:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for about_page
-- ----------------------------
DROP TABLE IF EXISTS `about_page`;
CREATE TABLE `about_page`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `banner_bg_color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `breadcrumb` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `sections` json NULL,
  `footer_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `footer_color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of about_page
-- ----------------------------
INSERT INTO `about_page` VALUES (1, '关于我们', 'linear-gradient(to right, #0b60c5, #127eea)', '当前位置： 首页 > 关于我们', '[{\"type\": \"text\", \"title\": \"平台建设背景\", \"content\": \"随着数字技术快速发展，基础教育正在步入智能时代。为了推动京津冀乡村基础教育的均衡性与可及性提升，我们以数智驱动为核心，通过构建数据平台、可视化系统与时空知识图谱，实现区域教育资源的科学配置与决策支撑。\"}, {\"type\": \"text\", \"title\": \"数据平台构建与成效\", \"content\": \"项目聚焦教育资源采集、分析与展示，构建了覆盖京津冀地区乡村初中教育数据的数据平台，涵盖学校基本信息、师资力量、招生情况、教学设施等多个维度，形成多源异构数据统一管理与展示体系，为教育治理提供支撑。\"}, {\"type\": \"list\", \"items\": [\"📊 教育数据可视化平台：提供实时交互图表与区域比较分析。\", \"📈 教育评估可视化工具：支持教学质量、资源配置等维度评估展示。\", \"🧠 时空知识图谱系统：融合地理信息与教育语义关系，支持区域教育趋势分析与预测。\"], \"title\": \"数智成果体系\"}, {\"type\": \"text\", \"title\": \"展望与未来\", \"content\": \"未来，我们将持续优化平台功能，扩展数据维度，增强教育治理智能化水平，助力国家教育数字化转型战略落地，建设具有示范效应的教育数智平台。\"}]', '2025年5月，由河北经贸大学管理科学与信息工程学院团队建设。', '#888', '2025-08-17 08:33:25');

-- ----------------------------
-- Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_ai_generated` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `question_id`(`question_id` ASC) USING BTREE,
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answers
-- ----------------------------
INSERT INTO `answers` VALUES (1, 1, '提升乡村教学质量可以从以下几个方面入手：1. 充分利用数字化教学资源...', 1, '2025-09-28 17:07:12', '2025-09-28 17:07:12');
INSERT INTO `answers` VALUES (2, 2, '解决留守儿童教育问题需要多方合作：1. 学校建立留守儿童档案...', 1, '2025-09-28 17:07:12', '2025-09-28 17:07:12');
INSERT INTO `answers` VALUES (3, 3, '解答：\n\n1. **培训与支持**：\n   - **教师培训**：组织教师参加数字化教学资源使用培训，提高教师对多媒体设备的操作能力和数字化教学资源的理解。\n   - **技术支持**：设立技术支持团队，及时解决教师在操作设备或使用资源时遇到的问题。\n\n2. **资源整合**：\n   - **建立资源库**：收集和整理适合乡村学校教学需求的数字化资源，建立校内资源库，方便教师查找和利用。\n   - **定制化资源**：鼓励教师根据自身教学需要，对现有资源进行改编或开发。\n\n3. **教学策略调整**：\n   - **混合式教学**：将数字化资源与传统教学方法相结合，设计互动性强、参与度高的教学活动。\n   - **项目式学习**：利用数字化资源支持项目式学习，鼓励学生主动探索和解决问题。\n\n4. **激励与评价**：\n   - **激励机制**：设立数字化教学资源使用奖励机制，鼓励教师积极参与。\n   - **评价体系**：将数字化教学资源的使用纳入教师评价体系，激励教师主动提升使用效率。\n\n5. **学生参与**：\n   - **学生培训**：指导学生如何有效利用数字化资源进行自主学习。\n   - **合作学习**：鼓励学生利用数字化资源进行小组合作学习，提高学习效果。\n\n6. **持续跟进**：\n   - **反馈与改进**：定期收集教师和学生的反馈，根据反馈调整数字化资源的使用策略。\n   - **更新与维护**：确保数字化资源库的持续更新，保持资源的时效性和适用性。\n\n通过上述措施，可以有效提升乡村学校数字化教学资源的使用效率，从而提高教学效果。', 1, '2025-09-29 08:14:31', '2025-09-29 08:14:31');
INSERT INTO `answers` VALUES (4, 3, '解答：\n\n1. **培训提升**：组织教师参加数字化教学资源培训，确保每位教师都能熟练操作多媒体设备，理解并运用数字化教学资源。\n\n2. **资源整合**：建立学校数字化教学资源库，收集和整理适合乡村教育的优质资源，方便教师查找和使用。\n\n3. **课程设计**：鼓励教师将数字化资源融入课程设计中，例如使用多媒体演示、在线互动等，提高课堂趣味性和互动性。\n\n4. **教学实践**：定期开展数字化教学示范课，让教师相互学习，共同进步。\n\n5. **评价激励**：建立数字化教学评价体系，对积极运用数字化资源的教师给予表彰和奖励。\n\n6. **家校合作**：引导家长了解数字化教学的优势，鼓励家长参与，共同关注孩子的学习。\n\n7. **持续更新**：定期更新数字化教学资源，确保内容与时代同步，符合学生需求。\n\n8. **技术支持**：设立技术支持团队，为教师提供及时的技术服务，解决使用过程中的问题。', 1, '2025-09-29 08:14:32', '2025-09-29 08:14:32');
INSERT INTO `answers` VALUES (5, 3, '解答：\n\n1. **培训提升能力**：组织教师参加数字化教学资源使用培训，包括多媒体设备操作、教学软件应用、在线资源检索等，确保每位教师都能熟练使用。\n\n2. **制定使用计划**：为每位教师制定数字化教学资源使用计划，明确每周或每月需要使用资源的课程和教学环节。\n\n3. **整合课程内容**：将数字化资源与课程内容有机结合，如使用多媒体课件辅助讲解，利用视频资源丰富教学内容。\n\n4. **互动式教学**：鼓励教师设计互动式教学活动，利用多媒体设备开展课堂讨论、小组合作等，提高学生参与度。\n\n5. **资源共享平台**：建立校内资源共享平台，方便教师之间交流数字化教学资源，促进资源共享。\n\n6. **评价与反馈**：设立数字化教学资源使用评价机制，对教师的使用情况进行定期评估，并提供反馈，激励教师持续改进。\n\n7. **鼓励创新实践**：鼓励教师尝试创新教学方法，如翻转课堂、在线学习等，充分利用数字化资源。\n\n8. **家校合作**：引导家长了解数字化教学资源，鼓励家长支持并参与孩子的数字化学习过程。\n\n9. **持续更新资源**：定期更新数字化教学资源，确保内容与时俱进，符合教育需求。\n\n10. **技术支持**：设立技术支持团队，及时解决教师在使用过程中遇到的技术问题，保障数字化教学资源的正常运行。', 1, '2025-09-29 08:14:33', '2025-09-29 08:14:33');
INSERT INTO `answers` VALUES (6, 3, '解答：\n\n1. **教师培训**：\n   - **组织培训**：定期组织教师参加数字化教学资源的培训，包括设备操作和教学应用。\n   - **实践演练**：通过模拟课堂，让教师实际操作多媒体设备，增强其使用信心。\n\n2. **资源整合**：\n   - **建立资源库**：收集和整理适合乡村教学的数字化资源，包括视频、音频、课件等。\n   - **分类管理**：根据学科、年级、教学目标等对资源进行分类，方便教师查找。\n\n3. **教学设计**：\n   - **结合实际**：将数字化资源与课程内容相结合，设计适合乡村学生的教学活动。\n   - **创新模式**：探索翻转课堂、混合式教学等新型教学模式。\n\n4. **激励措施**：\n   - **设立奖项**：对在数字化教学资源应用中表现突出的教师给予表彰和奖励。\n   - **评价体系**：将数字化教学资源应用纳入教师考核评价体系。\n\n5. **技术支持**：\n   - **维护保养**：定期对多媒体设备进行维护和保养，确保设备正常运行。\n   - **技术支持**：设立技术支持团队，解决教师在使用过程中遇到的技术问题。\n\n6. **家校合作**：\n   - **家长培训**：向家长介绍数字化教学资源，提高家长对数字化教学的认知。\n   - **互动交流**：鼓励家长参与学校组织的数字化教学活动，增进家校合作。\n\n通过以上措施，可以有效提升乡村学校教师对数字化教学资源的利用效率，从而提高教学效果。', 1, '2025-09-29 08:14:34', '2025-09-29 08:14:34');
INSERT INTO `answers` VALUES (7, 3, '解答：\n\n1. **培训提升**：组织教师参加数字化教学资源的培训，确保他们熟悉多媒体设备的使用方法以及如何有效整合资源到教学中。\n\n2. **资源筛选**：根据教学大纲和学生需求，筛选适合的数字化教学资源，如在线课程、教学视频、电子教材等。\n\n3. **课程设计**：在课程设计中融入数字化资源，例如，利用视频讲解复杂概念，或使用互动软件进行课堂练习。\n\n4. **示范教学**：挑选几位教师作为试点，进行数字化教学示范，展示如何将资源与教学活动相结合。\n\n5. **建立资源库**：建立学校内部的数字化教学资源库，方便教师查找和共享。\n\n6. **定期评估**：对数字化教学的效果进行定期评估，了解学生学习情况，根据评估结果调整教学策略。\n\n7. **互动教学**：利用数字化设备进行课堂互动，如通过投影仪展示学生的作业，或使用投票系统进行课堂问答。\n\n8. **家长沟通**：鼓励家长了解和支持数字化教学，邀请家长参与教学活动，增强家校合作。\n\n9. **技术支持**：确保学校有技术人员随时解决教师在使用数字化设备过程中遇到的问题。\n\n10. **激励机制**：设立奖励机制，对使用数字化教学资源效果显著的教师给予表彰和奖励。', 1, '2025-09-29 08:14:35', '2025-09-29 08:14:35');
INSERT INTO `answers` VALUES (8, 3, '解答：\n\n1. **培训提升**：组织教师参加数字化教学资源的培训，确保他们掌握多媒体设备的使用技巧和数字化资源的检索、应用方法。\n\n2. **资源整合**：建立校内数字化教学资源库，整合各类优质资源，包括视频、音频、课件等，方便教师按需查找。\n\n3. **教学设计**：鼓励教师将数字化资源融入教学设计中，结合课程内容和教学目标，制作互动性强、参与度高的教学方案。\n\n4. **教学观摩**：定期举办数字化教学观摩活动，分享优秀教师的经验，激发教师创新使用数字化资源的热情。\n\n5. **激励机制**：设立数字化教学资源使用奖，鼓励教师积极探索和实践，提高资源利用效率。\n\n6. **技术支持**：确保教师随时获得技术支持，如设备故障维修、软件升级等，降低使用过程中的障碍。\n\n7. **合作交流**：与其他学校或教育机构合作，共享数字化教学资源，扩大资源覆盖面。\n\n8. **持续跟踪**：对数字化资源的使用情况进行跟踪评估，及时调整策略，确保资源利用的最大化。', 1, '2025-09-29 08:14:35', '2025-09-29 08:14:35');
INSERT INTO `answers` VALUES (9, 3, '解答：\n\n1. **培训提升技能**：\n   - 组织教师参加数字化教学资源培训，学习如何有效使用多媒体设备。\n   - 邀请专家进行实操指导，让教师掌握基本操作和资源整合技巧。\n\n2. **资源整合与定制**：\n   - 建立学校资源库，收集适合乡村学生的数字化教学资源。\n   - 根据课程内容和教学目标，定制教学资源包，提高资源利用率。\n\n3. **课程设计与实施**：\n   - 将数字化资源融入课程设计，设计互动性强的教学活动。\n   - 利用多媒体设备进行课堂演示、案例分析，增强学生学习兴趣。\n\n4. **教学反思与改进**：\n   - 鼓励教师进行教学反思，分析数字化资源应用的效果。\n   - 根据反馈调整教学策略，不断优化教学过程。\n\n5. **激励与考核**：\n   - 建立激励机制，对有效利用数字化资源的教师给予表彰和奖励。\n   - 将数字化资源应用情况纳入教师绩效考核体系。\n\n6. **学生参与与评价**：\n   - 鼓励学生参与数字化教学活动，提高他们的信息素养。\n   - 定期收集学生对数字化教学的反馈，作为改进的依据。\n\n7. **家校合作**：\n   - 加强家校沟通，让家长了解数字化教学的优势，共同关注孩子的学习。\n   - 鼓励家长利用家庭资源支持孩子的数字化学习。\n\n通过以上措施，可以有效提升乡村学校教师对数字化教学资源的利用效率，从而提高教学效果。', 1, '2025-09-29 08:14:41', '2025-09-29 08:14:41');

-- ----------------------------
-- Table structure for edu_resources
-- ----------------------------
DROP TABLE IF EXISTS `edu_resources`;
CREATE TABLE `edu_resources`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category` enum('primary','junior') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of edu_resources
-- ----------------------------
INSERT INTO `edu_resources` VALUES (1, '小学资源网', 'https://i.postimg.cc/wMMxwq5z/image.png', 'https://www.xj5u.com/', 'primary', '优质小学教育资源平台', '2025-08-14 21:06:28');
INSERT INTO `edu_resources` VALUES (2, '国家中小学智慧教育平台', 'https://i.postimg.cc/SKGyq2Dq/image.png', 'https://basic.smartedu.cn/', 'primary', '教育部官方教育平台', '2025-08-14 21:06:28');
INSERT INTO `edu_resources` VALUES (3, '小学学科网', 'https://i.postimg.cc/sxbzKpDP/image.png', 'https://www.zxxk.com/', 'primary', '小学各学科教学资源', '2025-08-14 21:06:28');
INSERT INTO `edu_resources` VALUES (4, '学而思网校（初中）', 'https://i.postimg.cc/G25nhkY0/image.png', 'https://www.xueersi.com/', 'junior', '知名初中在线教育平台', '2025-08-14 21:06:28');
INSERT INTO `edu_resources` VALUES (5, '初中教学资源网', 'https://i.postimg.cc/KzMhj15R/image.png', 'https://www.21cnjy.com/', 'junior', '初中教师资源分享平台', '2025-08-14 21:06:28');
INSERT INTO `edu_resources` VALUES (6, '国家中小学智慧教育平台（初中）', 'https://i.postimg.cc/SKGyq2Dq/image.png', 'https://basic.smartedu.cn/', 'junior', '教育部官方教育平台\'', '2025-08-14 21:06:28');

-- ----------------------------
-- Table structure for education_thinktanks
-- ----------------------------
DROP TABLE IF EXISTS `education_thinktanks`;
CREATE TABLE `education_thinktanks`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of education_thinktanks
-- ----------------------------
INSERT INTO `education_thinktanks` VALUES (1, '21世纪教育研究院', 'https://i.postimg.cc/KzMhj15R/image.png', 'https://www.21cnjy.com/', '民间教育智库机构', '2025-08-14 21:28:35');
INSERT INTO `education_thinktanks` VALUES (2, '国家教育发展研究中心', 'https://i.postimg.cc/m2vPd9Pg/image.png', 'https://www.moe.gov.cn/s78/A10/', '教育部直属政策研究机构', '2025-08-14 21:28:35');
INSERT INTO `education_thinktanks` VALUES (3, '清华大学教育研究院', 'https://i.postimg.cc/j5S2WQFZ/image.png', 'https://www.ioe.tsinghua.edu.cn/', '清华大学下属教育研究机构', '2025-08-14 21:28:35');
INSERT INTO `education_thinktanks` VALUES (4, '北京师范大学教育研究院', 'https://i.postimg.cc/v8jTBnLt/image.png', 'https://fe.bnu.edu.cn/html/index.html', '北师大下属教育研究机构', '2025-08-14 21:28:35');

-- ----------------------------
-- Table structure for enterprise_platforms
-- ----------------------------
DROP TABLE IF EXISTS `enterprise_platforms`;
CREATE TABLE `enterprise_platforms`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '平台名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '平台描述',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '平台网址',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平台图片URL',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'enterprise' COMMENT '平台分类',
  `is_featured` tinyint(1) NULL DEFAULT 0 COMMENT '是否推荐',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enterprise_platforms
-- ----------------------------
INSERT INTO `enterprise_platforms` VALUES (1, '知网中国经济社会发展研究平台', 'CNKI提供的经济社会发展研究数据服务', 'https://www-cnki-net-443.webvpn.hueb.edu.cn/', 'https://i.postimg.cc/k5D4YHYd/image.png', 'enterprise', 1, '2025-08-14 15:35:59');

-- ----------------------------
-- Table structure for national_platforms
-- ----------------------------
DROP TABLE IF EXISTS `national_platforms`;
CREATE TABLE `national_platforms`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '平台名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '平台描述',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '平台网址',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平台LOGO图片URL',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'government' COMMENT '分类: government-政府部门, public-公共机构',
  `is_official` tinyint(1) NULL DEFAULT 1 COMMENT '是否官方平台',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '国家大数据平台表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of national_platforms
-- ----------------------------
INSERT INTO `national_platforms` VALUES (1, '国家数据局', '负责协调推进数据基础制度建设，统筹数据资源整合共享和开发利用', 'https://www.nda.gov.cn/sjj/index_pc.html', 'https://i.postimg.cc/GtXhm3zW/image.png', 'government', 1, '2025-08-14 15:22:01');
INSERT INTO `national_platforms` VALUES (2, '国家公共数据资源登记平台', '提供公共数据资源登记服务，促进数据要素流通', 'https://sjdj.nda.gov.cn/', 'https://i.postimg.cc/vm5Y6t3L/image.png', 'government', 1, '2025-08-14 15:22:01');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `published_date` date NULL DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 62 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, '京津优质中小学基础教育资源同雄安共享上台阶推进会', '教育部与京津冀教育部门联合举办推进会，揭牌多个名校长工作室，推动雄安教育高质量发展。', '2025-05-12', 'https://www.xiongan.gov.cn/20250515/f810a223410c402983b5cfe3ea96864f/20250515f810a223410c402983b5cfe3ea96864f_202505154b7acebb176244058eab79b9123f83a2.jpg', 'https://www.xiongan.gov.cn/20250515/f810a223410c402983b5cfe3ea96864f/c.html');
INSERT INTO `news` VALUES (3, '北京‘老校长下乡’帮扶河北阜平教育发展', '8年来21位老校长支教阜平18所乡村学校，开展教研活动280多次，惠及2万余名学生。', '2024-09-24', 'https://i.postimg.cc/Vvg6ZXJ0/QQ20250926-095443.png', 'https://news.zxxk.com/article/1017143.html');
INSERT INTO `news` VALUES (4, '唐景丽代表谈基础教育扩优提质', '2024年河北188所学校与京津合作，开展校际交流，选派骨干教师赴京津跟岗锻炼。', '2025-03-04', 'https://i.postimg.cc/tgF9mFfR/QQ20250926-095709.png', 'https://share.app3.jyb.cn/news_d/c6ea91af94a951211b6ba3e26f9d5b0d?from=...');
INSERT INTO `news` VALUES (5, '246所京津学校与河北‘联姻’推进智慧课堂', '引入5G、AI等技术，雄安史家胡同小学实现京雄两地学生‘同上一堂课’。', '2024-09-23', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/W020240923291241510349.jpg', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/t20240923_3902794.html');
INSERT INTO `news` VALUES (6, '裴红霞代表建议推动京津冀基础教育协同', '提议设立专项办公室共享研学资源，鼓励高校专家参与三地教育均衡发展。', '2024-03-06', 'https://www.omron.com.cn/technology/images/20240805/banner20240805.jpg', 'http://www.omron.com.cn/news.aspx?20231221917173/2ouwOV.html');
INSERT INTO `news` VALUES (8, '雄安文德幼儿园开园引入北京教育资源', '由北京优秀教师团队领衔，融合传统文化与科技教育，助力学前教育发展。', '2024-09-23', 'https://i.postimg.cc/VsKmTf7t/QQ20250926-095756.png', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/t20240923_3902794.html');
INSERT INTO `news` VALUES (9, '河北推进集团化办学促进教育均衡', '通过城乡共同体等模式，实现区域内基础教育扩优提质。', '2025-03-04', 'https://www.heb.chinanews.com/cr/2025/0924/2258747912.jpg', 'https://www.heb.chinanews.com.cn/kjww/20250924455061.shtml');
INSERT INTO `news` VALUES (10, '雄安启动‘春笋工程’助力高校疏解', '推进高校疏解项目前期手续，启动‘繁花工程’拓展与京津名校合作。', '2025-04-06', 'https://i.postimg.cc/D08DRTZQ/QQ20250926-095950.png', 'https://www.sohu.com/a/880348406_121956425');
INSERT INTO `news` VALUES (11, '京津冀基础教育协同发展推进会在雄安召开', '会议强调推动基础教育优质均衡发展，京津冀三地将共建教育协同发展机制，促进乡村教育资源共享。', '2025-05-14', 'https://www.xiongan.gov.cn/20250515/f810a223410c402983b5cfe3ea96864f/20250515f810a223410c402983b5cfe3ea96864f_2025051574d2c77a8efb473ba1c959be9a7c726f.jpg', 'https://heb.hebccw.cn/system/2025/05/18/102064061.shtml');
INSERT INTO `news` VALUES (12, '河北阜平试点AI教学，提升乡村教育水平', '依托北京技术支持，阜平县多所乡村学校开展AI辅助教学实验，提升教学质量和个性化水平。', '2025-05-10', 'https://www.zgggw.gov.cn/d/file/upload/image/20230705/1688547769240842.jpg', 'https://www.zgggw.gov.cn/gedixinxi/jy/17307.html');
INSERT INTO `news` VALUES (13, '天津专家团队帮扶邯郸乡村教育体育改革', '天津教育专家赴邯郸复兴区支教，帮助学生开展专项体质训练计划，改善学生整体体质。', '2025-05-08', 'https://i.postimg.cc/3JM5zkXd/QQ20250926-100319.png', 'https://www.sport.gov.cn/n20001280/n20001265/n20067533/c27185891/content.html');
INSERT INTO `news` VALUES (14, '雄安新区推进“春笋工程”支持高校疏解落地', '“春笋工程”加快推进基础教育配套设施建设，确保疏解高校附属学校顺利落地。', '2025-04-28', 'https://i.postimg.cc/sf70QwWg/QQ20250926-100405.png', 'https://news.eol.cn/yaowen/202503/t20250325_2660367.shtml');
INSERT INTO `news` VALUES (15, '北京优质中小学资源落地张家口乡村学校', '通过‘组团式’教育援助，北京多所名校与张家口乡村学校建立结对关系，提升整体办学质量。', '2025-04-15', 'https://mmbiz.qpic.cn/mmbiz_gif/zl4K8EY7LHe4cDrkiaHAlS1hIXLdFEFwtEMUI6t5EfGzE9B0n9ZLQS2icicGoxyvO9zCEMdGoLBstcJx2n2e77sXQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1', 'https://www.thepaper.cn/newsDetail_forward_11627132');
INSERT INTO `news` VALUES (16, '雄安文德幼儿园开设编程课程', '引入人工智能教育资源，文德幼儿园探索幼儿阶段编程启蒙教学，推动科技素养从娃娃抓起。', '2025-03-30', 'https://inews.gtimg.com/om_bt/O7zgoEubRYU3ojfVpxMftQiBWWRcOJj7X3WpkL0xRcMf4AA/1000', 'https://news.qq.com/rain/a/20240919A03GLP00');
INSERT INTO `news` VALUES (18, '河北石家庄五十三中学引入双师课堂', '通过北京名校与乡村学校远程协同授课，实现资源共享，提高教学效率与课堂互动。', '2025-03-18', 'https://www.jyb.cn/images/2025-03-18-53zhong.jpg', 'http://sjzjyj.sjz.gov.cn/a/2022/09/29/1664438145090.html');
INSERT INTO `news` VALUES (19, '北京专家助力阜平乡村教师培训计划', '联合清华、北师大等高校组织线下与线上培训，提升基层教师教学能力与研究水平。', '2025-03-05', 'https://www.jyb.cn/images/2025-03-05-fuping.jpg', 'https://www.zgggw.gov.cn/gedixinxi/jy/17307.html');
INSERT INTO `news` VALUES (20, '雄安小学探索智慧课堂书法教学', '使用电子书法平台与同步远程点评系统，提升学生书写规范性与传统文化理解。', '2025-02-28', 'https://www.jyb.cn/images/2025-02-28-shufa.jpg', 'https://www.xiongan.gov.cn/2024-03/12/c_1212340718.htm');
INSERT INTO `news` VALUES (21, '雄安新区与北京海淀区签署教育协同发展协议', '双方将在教师培训、课程共享、智慧校园建设等方面深度合作，推动雄安教育水平提升。', '2025-05-10', 'https://www.bjhdedu.cn/xw/jwdt/202306/W020230606339312297586.jpg', 'https://www.bjhdedu.cn/xw/jwdt/202306/t20230606_60479.html');
INSERT INTO `news` VALUES (22, '北京援建雄安三所‘交钥匙’学校全部投入使用', '北海幼儿园、史家胡同小学、北京四中雄安校区已招收学生超2000名，硬件设施对标北京标准。', '2024-09-01', 'https://i.postimg.cc/4yQ582vv/QQ20250926-100446.png', 'http://ww2.hbgrb.net/hbxw/202505/t20250515_293794.html');
INSERT INTO `news` VALUES (23, '雄安新区启动‘名师工作室’双百计划', '未来三年将引进100名北京特级教师和100名天津骨干教师设立工作室，覆盖全区中小学。', '2025-04-18', 'https://i.postimg.cc/pTGVDR4K/QQ20250926-100645.png', 'http://www.heb.chinanews.com.cn/hwkhb1/20250521453174.shtml');
INSERT INTO `news` VALUES (24, '京津名校在雄安开设‘同步课堂’', '通过5G技术实现雄安学生与北京八十中、天津一中等名校实时同课，已覆盖12所学校。', '2025-03-22', 'https://i.postimg.cc/Fzkv3cjQ/QQ20250926-100729.png', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/t20240923_3902794.html');
INSERT INTO `news` VALUES (25, '雄安新区实施基础教育‘双优’工程', '计划三年内培育50所优质学校和50个优秀教研组，重点提升乡村小规模学校质量。', '2025-02-15', 'https://www.news.cn/20250515/4068ccf291434510a0d372029c681aaf/202505154068ccf291434510a0d372029c681aaf_52e1de218e984a4e9fe241b6104582ff.jpg', 'http://tjbh.com/c/2025-05-15/1435925.shtml');
INSERT INTO `news` VALUES (27, '雄安新区首期‘未来校长’培训班结业', '30名乡村学校校长完成北京名校跟岗学习，将推行‘一校一策’改造计划。', '2024-12-10', 'http://df.youth.cn/dfzl/202505/W020250515595470396835.jpg', 'http://df.youth.cn/dfzl/202505/t20250515_16002146.htm');
INSERT INTO `news` VALUES (28, '天津南开中学向雄安开放数字教育资源', '共享精品课视频、试题库等1.2TB资源，惠及雄安32所中小学。', '2024-11-05', 'https://www.xiongan.gov.cn/2023-07/07/1212241936_16886944150011n.jpg', 'https://www.xiongan.gov.cn/2023-07/07/c_1212241936.htm');
INSERT INTO `news` VALUES (29, '雄安新区乡村学校‘智慧教室’全覆盖', '投入1.8亿元为58所乡村学校配备互动黑板、录播设备，实现与京津名校互联。', '2024-10-18', 'https://i.postimg.cc/fRRNf67K/QQ20250926-101124.png', 'http://finance.china.com.cn/news/20231123/6053998.shtml');
INSERT INTO `news` VALUES (30, '北京老教协对口支援雄安乡村教师', '组织退休特级教师每月驻校指导，已帮扶9所偏远小学提升教学质量。', '2024-09-15', 'https://i.postimg.cc/g2ZKQ0Kk/QQ20250926-101538.png', 'http://m.mbatrip.com/gundong/2020/0906/15240.html');
INSERT INTO `news` VALUES (31, '河北实施‘百校兴农’工程助力乡村振兴', '遴选100所城镇优质校结对帮扶乡村校，重点提升科学、艺术等薄弱学科。', '2025-05-08', '', 'https://share.app3.jyb.cn/news_d/c6ea91af94a951211b6ba3e26f9d5b0d');
INSERT INTO `news` VALUES (32, '河北乡村教师‘省培计划’覆盖全部学科', '2024年培训乡村教师3.2万人次，音乐、体育等紧缺学科培训占比提高至40%。', '2025-04-25', '', 'http://m.lygmedia.com/58/58/20250512/12317157.html');
INSERT INTO `news` VALUES (33, '河北启动‘城乡教育共同体’2.0版', '升级原有帮扶机制，要求城镇校每月至少派5名教师到结对乡村校驻点教学。', '2025-03-17', '', 'https://www.cs.com.cn/xwzx/hg/202102/t20210226_6141845.html');
INSERT INTO `news` VALUES (34, '河北乡村小规模学校‘在线课堂’全覆盖', '利用专递课堂解决师资不足问题，已开课1.2万节，惠及学生8.7万人。', '2025-02-28', '', 'https://news.zxxk.com/article/1017143.html');
INSERT INTO `news` VALUES (35, '河北提高乡村教师生活补助标准', '偏远地区乡村教师月补助最高达4000元，较2023年提升30%。', '2025-01-15', '', 'http://www.omron.com.cn/news.aspx?20231221917173/2ouwOV.html');
INSERT INTO `news` VALUES (36, '河北‘特岗教师’招聘向音体美倾斜', '2025年计划招聘3500人，其中艺术类教师占比首次突破25%。', '2024-12-05', '', 'http://finance.china.com.cn/news/20231123/6053998.shtml');
INSERT INTO `news` VALUES (37, '河北乡村学校‘暖心校车’工程启动', '投入5.6亿元为山区县配备标准化校车，解决1.2万名学生上下学难问题。', '2024-11-20', '', 'https://www.163.com/dy/article/JVGSBC5105568E2R.html');
INSERT INTO `news` VALUES (38, '河北推广‘走教制’补充乡村师资', '鼓励城镇教师到周边多所乡村学校轮流授课，按课时发放交通补贴。', '2024-10-10', '', 'http://m.mbatrip.com/gundong/2020/0906/15240.html');
INSERT INTO `news` VALUES (39, '河北建立乡村教师荣誉制度', '任教满30年乡村教师可获‘燕赵乡村教育奖’，并在职称评审中加分。', '2024-09-08', '', 'https://web.cmc.hebtv.com/cms/rmt0336_html/0/0rmhlm/mt/hbxwgb/zxxx/11049688.shtml');
INSERT INTO `news` VALUES (40, '河北‘青蓝工程’培养乡村青年教师', '组织2000名骨干教师与乡村新教师结对，通过线上平台常态化指导。', '2024-08-15', '', 'http://ww2.hbgrb.net/hbxw/202505/t20250515_293794.html');
INSERT INTO `news` VALUES (41, '北京‘双师课堂’覆盖河北23个脱贫县', '通过直播+本地辅导模式，让乡村学生共享北京四中、人大附中等优质课程。', '2025-05-05', '', 'https://share.app3.jyb.cn/news_d/c6ea91af94a951211b6ba3e26f9d5b0d');
INSERT INTO `news` VALUES (42, '天津‘名师送教’走进河北承德山区', '组织40名特级教师开展为期一个月的驻点教学，培训当地教师600余人次。', '2025-04-12', '', 'http://tjbh.com/c/2025-05-15/1435925.shtml');
INSERT INTO `news` VALUES (43, '北京朝阳区与河北保定共建‘教育云’', '共享数字化教学资源，保定300所乡村学校可实时调用北京优质课件。', '2025-03-08', '', 'http://df.youth.cn/dfzl/202505/t20250515_16002146.htm');
INSERT INTO `news` VALUES (44, '天津为河北乡村学校捐赠‘智慧图书角’', '配备电子阅读器和2000册图书，首批惠及50所偏远小学。', '2025-02-14', '', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/t20240923_3902794.html');
INSERT INTO `news` VALUES (45, '北京高校帮扶河北乡村学校科技教育', '清华、北航等10所高校为河北乡村校开设机器人、无人机等特色课程。', '2025-01-20', '', 'https://www.cs.com.cn/xwzx/hg/202102/t20210226_6141845.html');
INSERT INTO `news` VALUES (46, '京津‘影子校长’项目培养河北乡村管理者', '每年选派30名河北乡村校长到京津名校全程跟岗学习3个月。', '2024-12-18', '', 'http://m.lygmedia.com/58/58/20250512/12317157.html');
INSERT INTO `news` VALUES (47, '北京‘教育帮扶直通车’开进河北阜平', '提供定制化培训套餐，涵盖学校管理、课堂教学等6大模块。', '2024-11-25', '', 'https://news.zxxk.com/article/1017143.html');
INSERT INTO `news` VALUES (48, '天津南开区与河北邯郸开展教研共同体', '每月联合开展线上教研活动，共享优质教案和考试评价体系。', '2024-10-30', '', 'http://www.heb.chinanews.com.cn/hwkhb1/20250521453174.shtml');
INSERT INTO `news` VALUES (49, '北京‘乡村教师访名校’项目扩容', '2025年将安排500名河北乡村教师到北京优质校进行为期两周的沉浸式学习。', '2024-09-18', '', 'http://finance.china.com.cn/news/20231123/6053998.shtml');
INSERT INTO `news` VALUES (50, '京津高校在河北设立‘乡村教育研究中心’', '北师大、天津师大等高校联合开展乡村教育创新实践研究，已立项23个课题。', '2024-08-22', '', 'https://web.cmc.hebtv.com/cms/rmt0336_html/0/0rmhlm/mt/hbxwgb/zxxx/11049688.shtml');
INSERT INTO `news` VALUES (51, '雄安新区试行‘教育积分制’激励教师流动', '城区教师到乡村任教可获积分，用于职称评审、培训机会等优先权。', '2025-05-03', '', 'http://ww2.hbgrb.net/hbxw/202505/t20250515_293794.html');
INSERT INTO `news` VALUES (52, '河北‘乡村少年宫’覆盖率达92%', '利用课余时间开展非遗传承、科技制作等活动，惠及25万农村学生。', '2025-04-15', '', 'https://www.163.com/dy/article/JVGSBC5105568E2R.html');
INSERT INTO `news` VALUES (53, '京津冀联合开发‘红色研学’课程', '整合西柏坡、平津战役纪念馆等资源，打造适合乡村学校的思政教育体系。', '2025-03-28', '', 'http://tjbh.com/c/2025-05-15/1435925.shtml');
INSERT INTO `news` VALUES (54, '北京‘AI教师’助力河北乡村英语教学', '智能系统可实时纠正发音，已应用于200所乡村小学。', '2025-02-10', '', 'https://share.app3.jyb.cn/news_d/c6ea91af94a951211b6ba3e26f9d5b0d');
INSERT INTO `news` VALUES (55, '天津‘流动科技馆’走进河北乡村', '携带50件互动展具，每年巡展100所学校，激发学生科学兴趣。', '2025-01-05', '', 'http://df.youth.cn/dfzl/202505/t20250515_16002146.htm');
INSERT INTO `news` VALUES (56, '河北‘家校共育数字平台’上线', '提供家庭教育课程、学业辅导等功能，注册家长已超40万人。', '2024-12-12', '', 'http://m.mbatrip.com/gundong/2020/0906/15240.html');
INSERT INTO `news` VALUES (57, '京津名校在雄安开设‘暑期学院’', '面向乡村学生提供免费夏令营，涵盖STEAM、戏剧等特色课程。', '2024-11-08', '', 'https://www.beijing.gov.cn/ywdt/gzdt/202409/t20240923_3902794.html');
INSERT INTO `news` VALUES (58, '河北试点‘乡村教育观察员’制度', '聘请退休教师、大学生等监督教育政策落实，已反馈问题127条。', '2024-10-05', '', 'https://www.cs.com.cn/xwzx/hg/202102/t20210226_6141845.html');
INSERT INTO `news` VALUES (59, '北京‘教育慈善信托’资助河北贫困生', '累计发放助学金1200万元，资助3000余名乡村学生完成学业。', '2024-09-12', '', 'http://m.lygmedia.com/58/58/20250512/12317157.html');
INSERT INTO `news` VALUES (60, '京津冀联合发布《乡村学校美育发展指南》', '明确音乐、美术等课程实施标准，配套提供200课时优质教学资源包。', '2024-08-20', '', 'https://news.zxxk.com/article/1017143.html');

-- ----------------------------
-- Table structure for policy_library
-- ----------------------------
DROP TABLE IF EXISTS `policy_library`;
CREATE TABLE `policy_library`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `region` enum('北京','天津','河北','京津冀') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `publish_date` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of policy_library
-- ----------------------------
INSERT INTO `policy_library` VALUES (1, '京津冀乡村教育数字化推进方案', '推进京津冀乡村教育数字化发展的政策方案', 'https://news.eol.cn/yaowen/202302/t20230201_2280376.shtml', 'https://i.postimg.cc/FHQdHmFF/image.png', '京津冀', '2023-02-05', '2025-08-14 20:42:42');
INSERT INTO `policy_library` VALUES (2, '乡村教师支援机制政策', '关于乡村教师支援机制的政策文件', 'https://www.gov.cn/zhengce/zhengceku/2020-09/04/content_5540386.htm', 'https://i.postimg.cc/hjhh5tss/image.png', '京津冀', '2020-09-04', '2025-08-14 20:44:10');
INSERT INTO `policy_library` VALUES (3, '雄安教育共享政策体系', '雄安新区教育资源共享政策体系', 'https://www.xiongan.gov.cn/2022-11/21/c_1211702781.htm', 'https://i.postimg.cc/zDVd1mGP/image.png', '河北', '2022-11-21', '2025-08-14 20:44:21');

-- ----------------------------
-- Table structure for question_categories
-- ----------------------------
DROP TABLE IF EXISTS `question_categories`;
CREATE TABLE `question_categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `value`(`value` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_categories
-- ----------------------------
INSERT INTO `question_categories` VALUES (1, '教育政策', 'education-policy', '2025-09-28 17:06:40', '2025-09-28 17:06:40');
INSERT INTO `question_categories` VALUES (2, '教学方法', 'teaching-methods', '2025-09-28 17:06:40', '2025-09-28 17:06:40');
INSERT INTO `question_categories` VALUES (3, '教师发展', 'teacher-development', '2025-09-28 17:06:40', '2025-09-28 17:06:40');
INSERT INTO `question_categories` VALUES (4, '学生成长', 'student-growth', '2025-09-28 17:06:40', '2025-09-28 17:06:40');
INSERT INTO `question_categories` VALUES (5, '资源共享', 'resource-sharing', '2025-09-28 17:06:40', '2025-09-28 17:06:40');
INSERT INTO `question_categories` VALUES (6, '数字化应用', 'digital-application', '2025-09-28 17:06:40', '2025-09-28 17:06:40');

-- ----------------------------
-- Table structure for question_likes
-- ----------------------------
DROP TABLE IF EXISTS `question_likes`;
CREATE TABLE `question_likes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_question_user`(`question_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `question_likes_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `question_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_likes
-- ----------------------------

-- ----------------------------
-- Table structure for question_tag_relations
-- ----------------------------
DROP TABLE IF EXISTS `question_tag_relations`;
CREATE TABLE `question_tag_relations`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_question_tag`(`question_id` ASC, `tag_id` ASC) USING BTREE,
  INDEX `tag_id`(`tag_id` ASC) USING BTREE,
  CONSTRAINT `question_tag_relations_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `question_tag_relations_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `question_tags` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_tag_relations
-- ----------------------------

-- ----------------------------
-- Table structure for question_tags
-- ----------------------------
DROP TABLE IF EXISTS `question_tags`;
CREATE TABLE `question_tags`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of question_tags
-- ----------------------------
INSERT INTO `question_tags` VALUES (1, '乡村教师', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (2, '教育公平', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (3, '数字化转型', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (4, '师资力量', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (5, '留守儿童', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (6, '教学质量', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (7, '教育资源', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (8, '课程设计', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (9, '教学评估', '2025-09-28 17:06:40');
INSERT INTO `question_tags` VALUES (10, '家校合作', '2025-09-28 17:06:40');

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `questioner_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `likes` int NULL DEFAULT 0,
  `comments` int NULL DEFAULT 0,
  `status` enum('pending','answered') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `is_processing` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_value`(`category_value` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`category_value`) REFERENCES `question_categories` (`value`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questions
-- ----------------------------
INSERT INTO `questions` VALUES (1, '乡村教师如何提升教学质量？', '作为一名乡村教师，面对教学资源匮乏和学生基础薄弱的情况，应该如何有效提升教学质量？', 'teaching-methods', NULL, '乡村教师小李', 25, 12, 'answered', 0, '2025-09-28 17:07:12', '2025-09-28 17:07:12');
INSERT INTO `questions` VALUES (2, '如何解决乡村留守儿童的教育问题？', '我校有很多留守儿童，他们在学习和心理方面存在一些问题，应该如何有效解决？', 'student-growth', NULL, '张校长', 38, 20, 'answered', 0, '2025-09-28 17:07:12', '2025-09-28 17:07:12');
INSERT INTO `questions` VALUES (3, '乡村学校如何有效利用数字化教学资源？', '我校刚刚配备了多媒体教学设备，但教师使用效率不高，如何更好地利用这些资源提升教学效果？', 'digital-application', NULL, '王老师', 18, 8, 'answered', 0, '2025-09-28 17:07:12', '2025-09-29 08:14:31');

-- ----------------------------
-- Table structure for regions
-- ----------------------------
DROP TABLE IF EXISTS `regions`;
CREATE TABLE `regions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 199 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of regions
-- ----------------------------
INSERT INTO `regions` VALUES (1, '北京', '北京', '东城区');
INSERT INTO `regions` VALUES (2, '北京', '北京', '西城区');
INSERT INTO `regions` VALUES (3, '北京', '北京', '朝阳区');
INSERT INTO `regions` VALUES (4, '北京', '北京', '丰台区');
INSERT INTO `regions` VALUES (5, '北京', '北京', '石景山区');
INSERT INTO `regions` VALUES (6, '北京', '北京', '海淀区');
INSERT INTO `regions` VALUES (7, '北京', '北京', '门头沟区');
INSERT INTO `regions` VALUES (8, '北京', '北京', '房山区');
INSERT INTO `regions` VALUES (9, '北京', '北京', '通州区');
INSERT INTO `regions` VALUES (10, '北京', '北京', '顺义区');
INSERT INTO `regions` VALUES (11, '北京', '北京', '昌平区');
INSERT INTO `regions` VALUES (12, '北京', '北京', '大兴区');
INSERT INTO `regions` VALUES (13, '北京', '北京', '怀柔区');
INSERT INTO `regions` VALUES (14, '北京', '北京', '平谷区');
INSERT INTO `regions` VALUES (15, '北京', '北京', '密云区');
INSERT INTO `regions` VALUES (16, '北京', '北京', '延庆区');
INSERT INTO `regions` VALUES (17, '天津', '天津', '和平区');
INSERT INTO `regions` VALUES (18, '天津', '天津', '河东区');
INSERT INTO `regions` VALUES (19, '天津', '天津', '河西区');
INSERT INTO `regions` VALUES (20, '天津', '天津', '南开区');
INSERT INTO `regions` VALUES (21, '天津', '天津', '河北区');
INSERT INTO `regions` VALUES (22, '天津', '天津', '红桥区');
INSERT INTO `regions` VALUES (23, '天津', '天津', '东丽区');
INSERT INTO `regions` VALUES (24, '天津', '天津', '西青区');
INSERT INTO `regions` VALUES (25, '天津', '天津', '津南区');
INSERT INTO `regions` VALUES (26, '天津', '天津', '北辰区');
INSERT INTO `regions` VALUES (27, '天津', '天津', '武清区');
INSERT INTO `regions` VALUES (28, '天津', '天津', '宝坻区');
INSERT INTO `regions` VALUES (29, '天津', '天津', '滨海新区');
INSERT INTO `regions` VALUES (30, '天津', '天津', '宁河区');
INSERT INTO `regions` VALUES (31, '天津', '天津', '静海区');
INSERT INTO `regions` VALUES (32, '天津', '天津', '蓟州区');
INSERT INTO `regions` VALUES (33, '河北省', '石家庄', '长安区');
INSERT INTO `regions` VALUES (34, '河北省', '石家庄', '桥西区');
INSERT INTO `regions` VALUES (35, '河北省', '石家庄', '新华区');
INSERT INTO `regions` VALUES (36, '河北省', '石家庄', '井陉矿区');
INSERT INTO `regions` VALUES (37, '河北省', '石家庄', '裕华区');
INSERT INTO `regions` VALUES (38, '河北省', '石家庄', '藁城区');
INSERT INTO `regions` VALUES (39, '河北省', '石家庄', '鹿泉区');
INSERT INTO `regions` VALUES (40, '河北省', '石家庄', '栾城区');
INSERT INTO `regions` VALUES (41, '河北省', '石家庄', '井陉县');
INSERT INTO `regions` VALUES (42, '河北省', '石家庄', '正定县');
INSERT INTO `regions` VALUES (43, '河北省', '石家庄', '行唐县');
INSERT INTO `regions` VALUES (44, '河北省', '石家庄', '灵寿县');
INSERT INTO `regions` VALUES (45, '河北省', '石家庄', '高邑县');
INSERT INTO `regions` VALUES (46, '河北省', '石家庄', '深泽县');
INSERT INTO `regions` VALUES (47, '河北省', '石家庄', '赞皇县');
INSERT INTO `regions` VALUES (48, '河北省', '石家庄', '无极县');
INSERT INTO `regions` VALUES (49, '河北省', '石家庄', '平山县');
INSERT INTO `regions` VALUES (50, '河北省', '石家庄', '元氏县');
INSERT INTO `regions` VALUES (51, '河北省', '石家庄', '赵县');
INSERT INTO `regions` VALUES (52, '河北省', '石家庄', '辛集市');
INSERT INTO `regions` VALUES (53, '河北省', '石家庄', '晋州市');
INSERT INTO `regions` VALUES (54, '河北省', '石家庄', '新乐市');
INSERT INTO `regions` VALUES (55, '河北省', '唐山', '路南区');
INSERT INTO `regions` VALUES (56, '河北省', '唐山', '路北区');
INSERT INTO `regions` VALUES (57, '河北省', '唐山', '古冶区');
INSERT INTO `regions` VALUES (58, '河北省', '唐山', '开平区');
INSERT INTO `regions` VALUES (59, '河北省', '唐山', '丰南区');
INSERT INTO `regions` VALUES (60, '河北省', '唐山', '丰润区');
INSERT INTO `regions` VALUES (61, '河北省', '唐山', '曹妃甸区');
INSERT INTO `regions` VALUES (62, '河北省', '唐山', '滦南县');
INSERT INTO `regions` VALUES (63, '河北省', '唐山', '乐亭县');
INSERT INTO `regions` VALUES (64, '河北省', '唐山', '迁西县');
INSERT INTO `regions` VALUES (65, '河北省', '唐山', '玉田县');
INSERT INTO `regions` VALUES (66, '河北省', '唐山', '遵化市');
INSERT INTO `regions` VALUES (67, '河北省', '唐山', '迁安市');
INSERT INTO `regions` VALUES (68, '河北省', '秦皇岛', '海港区');
INSERT INTO `regions` VALUES (69, '河北省', '秦皇岛', '山海关区');
INSERT INTO `regions` VALUES (70, '河北省', '秦皇岛', '北戴河区');
INSERT INTO `regions` VALUES (71, '河北省', '秦皇岛', '抚宁区');
INSERT INTO `regions` VALUES (72, '河北省', '秦皇岛', '青龙满族自治县');
INSERT INTO `regions` VALUES (73, '河北省', '秦皇岛', '昌黎县');
INSERT INTO `regions` VALUES (74, '河北省', '秦皇岛', '卢龙县');
INSERT INTO `regions` VALUES (75, '河北省', '邯郸', '邯山区');
INSERT INTO `regions` VALUES (76, '河北省', '邯郸', '丛台区');
INSERT INTO `regions` VALUES (77, '河北省', '邯郸', '复兴区');
INSERT INTO `regions` VALUES (78, '河北省', '邯郸', '峰峰矿区');
INSERT INTO `regions` VALUES (79, '河北省', '邯郸', '肥乡区');
INSERT INTO `regions` VALUES (80, '河北省', '邯郸', '永年区');
INSERT INTO `regions` VALUES (81, '河北省', '邯郸', '临漳县');
INSERT INTO `regions` VALUES (82, '河北省', '邯郸', '成安县');
INSERT INTO `regions` VALUES (83, '河北省', '邯郸', '大名县');
INSERT INTO `regions` VALUES (84, '河北省', '邯郸', '涉县');
INSERT INTO `regions` VALUES (85, '河北省', '邯郸', '磁县');
INSERT INTO `regions` VALUES (86, '河北省', '邯郸', '邱县');
INSERT INTO `regions` VALUES (87, '河北省', '邯郸', '鸡泽县');
INSERT INTO `regions` VALUES (88, '河北省', '邯郸', '广平县');
INSERT INTO `regions` VALUES (89, '河北省', '邯郸', '馆陶县');
INSERT INTO `regions` VALUES (90, '河北省', '邯郸', '魏县');
INSERT INTO `regions` VALUES (91, '河北省', '邯郸', '曲周县');
INSERT INTO `regions` VALUES (92, '河北省', '邯郸', '武安市');
INSERT INTO `regions` VALUES (93, '河北省', '邢台', '襄都区');
INSERT INTO `regions` VALUES (94, '河北省', '邢台', '信都区');
INSERT INTO `regions` VALUES (95, '河北省', '邢台', '任泽区');
INSERT INTO `regions` VALUES (96, '河北省', '邢台', '南和区');
INSERT INTO `regions` VALUES (97, '河北省', '邢台', '临城县');
INSERT INTO `regions` VALUES (98, '河北省', '邢台', '内丘县');
INSERT INTO `regions` VALUES (99, '河北省', '邢台', '柏乡县');
INSERT INTO `regions` VALUES (100, '河北省', '邢台', '隆尧县');
INSERT INTO `regions` VALUES (101, '河北省', '邢台', '宁晋县');
INSERT INTO `regions` VALUES (102, '河北省', '邢台', '巨鹿县');
INSERT INTO `regions` VALUES (103, '河北省', '邢台', '新河县');
INSERT INTO `regions` VALUES (104, '河北省', '邢台', '广宗县');
INSERT INTO `regions` VALUES (105, '河北省', '邢台', '平乡县');
INSERT INTO `regions` VALUES (106, '河北省', '邢台', '威县');
INSERT INTO `regions` VALUES (107, '河北省', '邢台', '清河县');
INSERT INTO `regions` VALUES (108, '河北省', '邢台', '临西县');
INSERT INTO `regions` VALUES (109, '河北省', '邢台', '南宫市');
INSERT INTO `regions` VALUES (110, '河北省', '邢台', '沙河市');
INSERT INTO `regions` VALUES (111, '河北省', '保定', '竞秀区');
INSERT INTO `regions` VALUES (112, '河北省', '保定', '莲池区');
INSERT INTO `regions` VALUES (113, '河北省', '保定', '满城区');
INSERT INTO `regions` VALUES (114, '河北省', '保定', '清苑区');
INSERT INTO `regions` VALUES (115, '河北省', '保定', '徐水区');
INSERT INTO `regions` VALUES (116, '河北省', '保定', '涞水县');
INSERT INTO `regions` VALUES (117, '河北省', '保定', '阜平县');
INSERT INTO `regions` VALUES (118, '河北省', '保定', '定兴县');
INSERT INTO `regions` VALUES (119, '河北省', '保定', '唐县');
INSERT INTO `regions` VALUES (120, '河北省', '保定', '高阳县');
INSERT INTO `regions` VALUES (121, '河北省', '保定', '容城县');
INSERT INTO `regions` VALUES (122, '河北省', '保定', '涞源县');
INSERT INTO `regions` VALUES (123, '河北省', '保定', '望都县');
INSERT INTO `regions` VALUES (124, '河北省', '保定', '安新县');
INSERT INTO `regions` VALUES (125, '河北省', '保定', '易县');
INSERT INTO `regions` VALUES (126, '河北省', '保定', '曲阳县');
INSERT INTO `regions` VALUES (127, '河北省', '保定', '蠡县');
INSERT INTO `regions` VALUES (128, '河北省', '保定', '顺平县');
INSERT INTO `regions` VALUES (129, '河北省', '保定', '博野县');
INSERT INTO `regions` VALUES (130, '河北省', '保定', '雄县');
INSERT INTO `regions` VALUES (131, '河北省', '保定', '涿州市');
INSERT INTO `regions` VALUES (132, '河北省', '保定', '定州市');
INSERT INTO `regions` VALUES (133, '河北省', '保定', '安国市');
INSERT INTO `regions` VALUES (134, '河北省', '保定', '高碑店市');
INSERT INTO `regions` VALUES (135, '河北省', '张家口', '桥东区');
INSERT INTO `regions` VALUES (136, '河北省', '张家口', '桥西区');
INSERT INTO `regions` VALUES (137, '河北省', '张家口', '宣化区');
INSERT INTO `regions` VALUES (138, '河北省', '张家口', '下花园区');
INSERT INTO `regions` VALUES (139, '河北省', '张家口', '万全区');
INSERT INTO `regions` VALUES (140, '河北省', '张家口', '崇礼区');
INSERT INTO `regions` VALUES (141, '河北省', '张家口', '张北县');
INSERT INTO `regions` VALUES (142, '河北省', '张家口', '康保县');
INSERT INTO `regions` VALUES (143, '河北省', '张家口', '沽源县');
INSERT INTO `regions` VALUES (144, '河北省', '张家口', '尚义县');
INSERT INTO `regions` VALUES (145, '河北省', '张家口', '蔚县');
INSERT INTO `regions` VALUES (146, '河北省', '张家口', '阳原县');
INSERT INTO `regions` VALUES (147, '河北省', '张家口', '怀安县');
INSERT INTO `regions` VALUES (148, '河北省', '张家口', '怀来县');
INSERT INTO `regions` VALUES (149, '河北省', '张家口', '涿鹿县');
INSERT INTO `regions` VALUES (150, '河北省', '张家口', '赤城县');
INSERT INTO `regions` VALUES (151, '河北省', '承德', '双桥区');
INSERT INTO `regions` VALUES (152, '河北省', '承德', '双滦区');
INSERT INTO `regions` VALUES (153, '河北省', '承德', '鹰手营子矿区');
INSERT INTO `regions` VALUES (154, '河北省', '承德', '承德县');
INSERT INTO `regions` VALUES (155, '河北省', '承德', '兴隆县');
INSERT INTO `regions` VALUES (156, '河北省', '承德', '滦平县');
INSERT INTO `regions` VALUES (157, '河北省', '承德', '隆化县');
INSERT INTO `regions` VALUES (158, '河北省', '承德', '丰宁满族自治县');
INSERT INTO `regions` VALUES (159, '河北省', '承德', '宽城满族自治县');
INSERT INTO `regions` VALUES (160, '河北省', '承德', '围场满族蒙古族自治县');
INSERT INTO `regions` VALUES (161, '河北省', '承德', '平泉市');
INSERT INTO `regions` VALUES (162, '河北省', '沧州', '新华区');
INSERT INTO `regions` VALUES (163, '河北省', '沧州', '运河区');
INSERT INTO `regions` VALUES (164, '河北省', '沧州', '沧县');
INSERT INTO `regions` VALUES (165, '河北省', '沧州', '青县');
INSERT INTO `regions` VALUES (166, '河北省', '沧州', '东光县');
INSERT INTO `regions` VALUES (167, '河北省', '沧州', '海兴县');
INSERT INTO `regions` VALUES (168, '河北省', '沧州', '盐山县');
INSERT INTO `regions` VALUES (169, '河北省', '沧州', '肃宁县');
INSERT INTO `regions` VALUES (170, '河北省', '沧州', '南皮县');
INSERT INTO `regions` VALUES (171, '河北省', '沧州', '吴桥县');
INSERT INTO `regions` VALUES (172, '河北省', '沧州', '献县');
INSERT INTO `regions` VALUES (173, '河北省', '沧州', '孟村回族自治县');
INSERT INTO `regions` VALUES (174, '河北省', '沧州', '泊头市');
INSERT INTO `regions` VALUES (175, '河北省', '沧州', '任丘市');
INSERT INTO `regions` VALUES (176, '河北省', '沧州', '黄骅市');
INSERT INTO `regions` VALUES (177, '河北省', '沧州', '河间市');
INSERT INTO `regions` VALUES (178, '河北省', '廊坊', '安次区');
INSERT INTO `regions` VALUES (179, '河北省', '廊坊', '广阳区');
INSERT INTO `regions` VALUES (180, '河北省', '廊坊', '固安县');
INSERT INTO `regions` VALUES (181, '河北省', '廊坊', '永清县');
INSERT INTO `regions` VALUES (182, '河北省', '廊坊', '香河县');
INSERT INTO `regions` VALUES (183, '河北省', '廊坊', '大城县');
INSERT INTO `regions` VALUES (184, '河北省', '廊坊', '文安县');
INSERT INTO `regions` VALUES (185, '河北省', '廊坊', '大厂回族自治县');
INSERT INTO `regions` VALUES (186, '河北省', '廊坊', '霸州市');
INSERT INTO `regions` VALUES (187, '河北省', '廊坊', '三河市');
INSERT INTO `regions` VALUES (188, '河北省', '衡水', '桃城区');
INSERT INTO `regions` VALUES (189, '河北省', '衡水', '冀州区');
INSERT INTO `regions` VALUES (190, '河北省', '衡水', '枣强县');
INSERT INTO `regions` VALUES (191, '河北省', '衡水', '武邑县');
INSERT INTO `regions` VALUES (192, '河北省', '衡水', '武强县');
INSERT INTO `regions` VALUES (193, '河北省', '衡水', '饶阳县');
INSERT INTO `regions` VALUES (194, '河北省', '衡水', '安平县');
INSERT INTO `regions` VALUES (195, '河北省', '衡水', '故城县');
INSERT INTO `regions` VALUES (196, '河北省', '衡水', '景县');
INSERT INTO `regions` VALUES (197, '河北省', '衡水', '阜城县');
INSERT INTO `regions` VALUES (198, '河北省', '衡水', '深州市');

-- ----------------------------
-- Table structure for research_platforms
-- ----------------------------
DROP TABLE IF EXISTS `research_platforms`;
CREATE TABLE `research_platforms`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of research_platforms
-- ----------------------------
INSERT INTO `research_platforms` VALUES (1, '中国知网科研平台', 'https://i.postimg.cc/k5D4YHYd/image.png', 'https://www.cnki.net/', '中国最大的学术资源平台', '2025-08-14 21:18:38');
INSERT INTO `research_platforms` VALUES (2, '万方数据科研支持', 'https://i.postimg.cc/cC7RscgT/image.png', 'https://www.wanfangdata.com.cn/', '综合性学术资源服务平台', '2025-08-14 21:18:38');
INSERT INTO `research_platforms` VALUES (3, '维普论文资源平台', 'https://i.postimg.cc/gkYRV86F/image.png', 'https://www.cqvip.com/', '中文期刊论文资源平台', '2025-08-14 21:18:38');

-- ----------------------------
-- Table structure for resource_categories
-- ----------------------------
DROP TABLE IF EXISTS `resource_categories`;
CREATE TABLE `resource_categories`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '分类描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资源分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resource_categories
-- ----------------------------
INSERT INTO `resource_categories` VALUES (1, '国家数据库', '国家级的统计数据资源', '2025-08-13 20:59:49');
INSERT INTO `resource_categories` VALUES (2, '地区数据库', '各省市的公共数据资源', '2025-08-13 20:59:49');

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '资源ID',
  `category_id` int NOT NULL COMMENT '分类ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '资源标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '资源描述',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '资源链接',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片',
  `is_featured` tinyint(1) NULL DEFAULT 0 COMMENT '是否推荐',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `category_type` enum('national','regional') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '资源分类类型',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_id`(`category_id` ASC) USING BTREE,
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `resource_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资源数据表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES (1, 1, '年度数据', '国家统计局年度数据', 'https://data.stats.gov.cn/easyquery.htm?cn=C01', 'https://i.postimg.cc/8cZt0TYt/image.png', 0, '2025-08-13 20:59:49', 'national');
INSERT INTO `resources` VALUES (2, 1, '各部门数据', '国家各部门统计数据', 'https://data.stats.gov.cn/staticreq.htm', 'https://i.postimg.cc/65zDkXRs/image.png', 0, '2025-08-13 20:59:49', 'national');
INSERT INTO `resources` VALUES (3, 2, '北京市公共数据开放平台', '北京市政务数据资源', 'https://data.beijing.gov.cn', 'https://i.postimg.cc/4ycx83nT/image.png', 0, '2025-08-13 20:59:49', 'regional');
INSERT INTO `resources` VALUES (4, 2, '天津市公共数据开放平台', '天津市政务数据资源', 'https://open.data.tj.gov.cn/', 'https://i.postimg.cc/BQvh118y/image.png', 0, '2025-08-13 20:59:49', 'regional');
INSERT INTO `resources` VALUES (5, 2, '河北省公共数据开放平台', '河北省政务数据资源', 'https://szj.hebei.gov.cn/hbggsj/home', 'https://i.postimg.cc/W40SPGKD/image.png', 0, '2025-08-13 20:59:49', 'regional');

-- ----------------------------
-- Table structure for surveys
-- ----------------------------
DROP TABLE IF EXISTS `surveys`;
CREATE TABLE `surveys`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'university',
  `is_featured` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_featured`(`is_featured` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '调查数据库表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of surveys
-- ----------------------------
INSERT INTO `surveys` VALUES (1, '中国健康与养老追踪调查（CHARLS）', '北京大学开展的全国性养老与健康调查研究', 'https://charls.pku.edu.cn/', 'https://i.postimg.cc/Y0yYK0zD/image.png', 'university', 0, '2025-08-14 14:44:38');
INSERT INTO `surveys` VALUES (2, '中国综合社会调查CGSS', '中国人民大学开展的综合社会调查项目', 'https://cgss.ruc.edu.cn/', 'https://i.postimg.cc/504CXLPk/CGSS.png', 'university', 0, '2025-08-14 14:44:38');
INSERT INTO `surveys` VALUES (3, '中国家庭金融调查CHFS', '西南财经大学开展的家庭金融调查研究', 'https://chfs.swufe.edu.cn/', 'https://i.postimg.cc/3JTdNgdj/CHFS.png', 'university', 0, '2025-08-14 14:44:38');
INSERT INTO `surveys` VALUES (4, '中国教育追踪调查CEPS', '中国人民大学开展的教育追踪调查研究', 'https://ceps.ruc.edu.cn/', 'https://i.postimg.cc/WzrFK8tz/CEPS.png', 'university', 0, '2025-08-14 14:44:38');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, '河北经贸大学', '王鑫铄', '15133261531', '$2b$10$RrqJi.fntGIp3.jVO6.yx.3BmOMyRneXW2MX8T7o3mQPvmt/Zvmdi', '河北省', '石家庄', '新华区', '2025-08-16 13:52:40');
INSERT INTO `users` VALUES (3, '河北经贸大学', '王', '18333281966', '$2b$10$gWmIb5zek693eRN6sr8NCe08En6IMtUh0VyoqPgK19V6kimZ8ONom', '河北省', '石家庄', '新华区', '2025-09-05 11:49:14');

-- ----------------------------
-- Table structure for users_force
-- ----------------------------
DROP TABLE IF EXISTS `users_force`;
CREATE TABLE `users_force`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `createTime` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_force
-- ----------------------------
INSERT INTO `users_force` VALUES (1, 'https://randomuser.me/api/portraits/men/1.jpg', '张三', 'zhangsan@example.com', 'admin', '2023-01-01 10:00:00', 1);
INSERT INTO `users_force` VALUES (2, 'https://randomuser.me/api/portraits/women/2.jpg', '李四', 'lisi@example.com', 'user', '2023-02-01 14:30:00', 1);
INSERT INTO `users_force` VALUES (3, 'https://randomuser.me/api/portraits/men/3.jpg', '王五', 'wangwu@example.com', 'user', '2023-03-15 09:20:00', 0);
INSERT INTO `users_force` VALUES (4, 'https://randomuser.me/api/portraits/women/4.jpg', '赵六', 'zhaoliu@example.com', 'user', '2023-04-10 13:40:00', 1);
INSERT INTO `users_force` VALUES (5, 'https://randomuser.me/api/portraits/men/5.jpg', '周七', 'zhouqi@example.com', 'user', '2023-05-20 11:50:00', 0);
INSERT INTO `users_force` VALUES (6, 'https://randomuser.me/api/portraits/women/6.jpg', '吴八', 'wuba@example.com', 'admin', '2023-06-05 15:30:00', 1);
INSERT INTO `users_force` VALUES (8, 'https://randomuser.me/api/portraits/women/8.jpg', '钱十', 'qianshi@example.com', 'admin', '2023-08-01 16:10:00', 1);
INSERT INTO `users_force` VALUES (9, 'https://randomuser.me/api/portraits/lego/1.jpg', '王鑫铄', '3218422140@qq.com', 'admin', '2025-08-16 14:54:40', 1);

SET FOREIGN_KEY_CHECKS = 1;
