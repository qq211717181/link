const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

// 获取用户的所有分类和链接
router.get('/', authMiddleware, async (req, res) => {
    try {
        const categories = await db.prepare(`
      SELECT * FROM categories 
      WHERE user_id = ? 
      ORDER BY position ASC
    `).all(req.userId);

        const categoriesWithLinks = await Promise.all(categories.map(async (category) => {
            const links = await db.prepare(`
        SELECT * FROM links 
        WHERE category_id = ? 
        ORDER BY position ASC
      `).all(category.id);

            return {
                ...category,
                links
            };
        }));

        res.json(categoriesWithLinks);
    } catch (error) {
        console.error('获取书签错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 创建分类
router.post('/categories', authMiddleware, async (req, res) => {
    try {
        const { name, icon } = req.body;

        // 获取当前最大 position
        const maxPosition = await db.prepare('SELECT MAX(position) as max FROM categories WHERE user_id = ?').get(req.userId);
        const position = (maxPosition.max || 0) + 1;

        const result = await db.prepare(`
      INSERT INTO categories (user_id, name, icon, position) 
      VALUES (?, ?, ?, ?)
    `).run(req.userId, name, icon || null, position);

        res.status(201).json({
            id: result.lastInsertRowid,
            user_id: req.userId,
            name,
            icon,
            position
        });
    } catch (error) {
        console.error('创建分类错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 批量更新分类位置 - 必须在 /categories/:id 路由之前定义
router.put('/categories/reorder', authMiddleware, async (req, res) => {
    try {
        const { categories } = req.body;
        console.log('收到重排序请求:', JSON.stringify(categories));

        if (!Array.isArray(categories)) {
            console.error('无效的数据格式: categories 不是数组');
            return res.status(400).json({ error: '无效的数据格式' });
        }

        for (const category of categories) {
            console.log(`更新分类 ${category.id} 位置为 ${category.position}`);
            await db.prepare('UPDATE categories SET position = ? WHERE id = ? AND user_id = ?')
                .run(category.position, category.id, req.userId);
        }

        console.log('重排序成功');
        res.json({ message: '更新成功' });
    } catch (error) {
        console.error('重新排序错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新分类
router.put('/categories/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon, position } = req.body;

        const category = await db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, req.userId);
        if (!category) {
            return res.status(404).json({ error: '分类不存在' });
        }

        await db.prepare(`
      UPDATE categories 
      SET name = COALESCE(?, name),
          icon = COALESCE(?, icon),
          position = COALESCE(?, position),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(name, icon, position, id, req.userId);

        res.json({ message: '更新成功' });
    } catch (error) {
        console.error('更新分类错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 删除分类
router.delete('/categories/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const category = await db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, req.userId);
        if (!category) {
            return res.status(404).json({ error: '分类不存在' });
        }

        await db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?').run(id, req.userId);

        res.json({ message: '删除成功' });
    } catch (error) {
        console.error('删除分类错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 批量导入分类和链接
router.post('/import', authMiddleware, async (req, res) => {
    try {
        const { categories } = req.body;

        if (!Array.isArray(categories)) {
            return res.status(400).json({ error: '无效的数据格式' });
        }

        // 获取当前最大 position
        const maxPosition = await db.prepare('SELECT MAX(position) as max FROM categories WHERE user_id = ?').get(req.userId);
        let currentPosition = (maxPosition.max || 0) + 1;

        const insertedCategories = [];

        for (const category of categories) {
            // 插入分类
            const categoryResult = await db.prepare(`
        INSERT INTO categories (user_id, name, icon, position) 
        VALUES (?, ?, ?, ?)
      `).run(req.userId, category.name, category.icon || null, currentPosition);

            const categoryId = categoryResult.lastInsertRowid;

            // 插入该分类下的链接
            if (Array.isArray(category.links)) {
                for (let i = 0; i < category.links.length; i++) {
                    const link = category.links[i];
                    await db.prepare(`
            INSERT INTO links (category_id, title, url, icon, position) 
            VALUES (?, ?, ?, ?, ?)
          `).run(categoryId, link.title, link.url, link.icon || null, i);
                }
            }

            insertedCategories.push({
                id: categoryId,
                name: category.name,
                position: currentPosition
            });

            currentPosition++;
        }

        res.status(201).json({
            message: '导入成功',
            categories: insertedCategories
        });
    } catch (error) {
        console.error('导入书签错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 添加链接到分类
router.post('/categories/:categoryId/links', authMiddleware, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { title, url, icon } = req.body;

        // 验证分类所有权
        const category = await db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(categoryId, req.userId);
        if (!category) {
            return res.status(404).json({ error: '分类不存在' });
        }

        // 获取当前最大 position
        const maxPosition = await db.prepare('SELECT MAX(position) as max FROM links WHERE category_id = ?').get(categoryId);
        const position = (maxPosition.max || 0) + 1;

        const result = await db.prepare(`
      INSERT INTO links (category_id, title, url, icon, position) 
      VALUES (?, ?, ?, ?, ?)
    `).run(categoryId, title, url, icon || null, position);

        res.status(201).json({
            id: result.lastInsertRowid,
            category_id: categoryId,
            title,
            url,
            icon,
            position
        });
    } catch (error) {
        console.error('添加链接错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新链接
router.put('/links/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, icon, position } = req.body;

        // 验证链接所有权
        const link = await db.prepare(`
      SELECT links.* FROM links 
      JOIN categories ON links.category_id = categories.id 
      WHERE links.id = ? AND categories.user_id = ?
    `).get(id, req.userId);

        if (!link) {
            return res.status(404).json({ error: '链接不存在' });
        }

        await db.prepare(`
      UPDATE links 
      SET title = COALESCE(?, title),
          url = COALESCE(?, url),
          icon = COALESCE(?, icon),
          position = COALESCE(?, position),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, url, icon, position, id);

        res.json({ message: '更新成功' });
    } catch (error) {
        console.error('更新链接错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 删除链接
router.delete('/links/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // 验证链接所有权
        const link = await db.prepare(`
      SELECT links.* FROM links 
      JOIN categories ON links.category_id = categories.id 
      WHERE links.id = ? AND categories.user_id = ?
    `).get(id, req.userId);

        if (!link) {
            return res.status(404).json({ error: '链接不存在' });
        }

        await db.prepare('DELETE FROM links WHERE id = ?').run(id);

        res.json({ message: '删除成功' });
    } catch (error) {
        console.error('删除链接错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 清空所有数据
router.delete('/all', authMiddleware, async (req, res) => {
    try {
        console.log(`用户 ${req.userId} 请求清空数据`);

        // 先删除该用户所有分类下的链接
        const deleteLinksResult = db.prepare(`
            DELETE FROM links 
            WHERE category_id IN (SELECT id FROM categories WHERE user_id = ?)
        `).run(req.userId);
        console.log(`删除了 ${deleteLinksResult.changes} 个链接`);

        // 再删除该用户的所有分类
        const deleteCategoriesResult = db.prepare('DELETE FROM categories WHERE user_id = ?').run(req.userId);
        console.log(`删除了 ${deleteCategoriesResult.changes} 个分类`);

        res.json({ message: '所有数据已清空' });
    } catch (error) {
        console.error('清空数据错误:', error);
        res.status(500).json({ error: '服务器错误: ' + error.message });
    }
});

module.exports = router;
