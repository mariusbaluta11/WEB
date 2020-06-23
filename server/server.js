
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const models = require('./models')
const SearchManager = models.SearchManager

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('../simple-app/build'))

app.get('/create', async (req, res) => {
	try {
		await sequelize.sync({ force: true })
		res.status(201).json({ message: 'created' })
	}
	catch (e) {
		console.warn(e)
		res.status(500).json({ message: 'server error' })
	}
})

// API To fetch list of words searched with their count.
app.get('/get-words', async (req, res) => {
	try {
		let words = await SearchManager.findAll()
		res.status(200).json(words)
	}
	catch (e) {
		console.warn(e)
		res.status(500).json({ message: 'server error' })
	}
})

/**
 * API to search word and display count
 */
app.post('/search-word', async (req, res) => {
	try {
		if (req.query.bulk && req.query.bulk == 'on') {
			await SearchManager.bulkCreate(req.body)
			res.status(201).json({ message: 'created' })
		}
		else {
			let a = SearchManager.findOne(
				{
					where: {
						word: req.body.word,
						category: req.body.category
					}
				}).then(async (word, err) => {
					// Check if word and category exists in db
					if (word) {
						await word.update({
							count: word.count + 1
						}).then((succ, err) => {
							if (succ) {
								res.status(201).json({ message: 'created' })
							}
							if (err) {
								console.log(err)
								res.status(500).json({ message: 'server error' })
							}
						})
					} else {
						await SearchManager.create({ ...req.body, ...{ "count": 1 } })
						res.status(201).json({ message: 'created' })
					}
				})
		}
	}
	catch (e) {
		console.warn(e)
		res.status(500).json({ message: 'server error' })
	}
})

// app.get('/books/:id', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.id)
// 		if (book) {
// 			res.status(200).json(book)
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.put('/books/:id', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.id)
// 		if (book) {
// 			await book.update(req.body)
// 			res.status(202).json({ message: 'accepted' })
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.delete('/books/:id', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.id)
// 		if (book) {
// 			await book.destroy()
// 			res.status(202).json({ message: 'accepted' })
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.get('/books/:bid/chapters', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.bid)
// 		if (book) {
// 			let chapters = await book.getChapters()
// 			res.status(200).json(chapters)
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.get('/books/:bid/chapters/:cid', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.bid)
// 		if (book) {
// 			let chapters = await book.getChapters({ where: { id: req.params.cid } })
// 			res.status(200).json(chapters.shift())
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.post('/books/:bid/chapters', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.bid)
// 		if (book) {
// 			let chapter = req.body
// 			chapter.book_id = book.id
// 			await Chapter.create(chapter)
// 			res.status(201).json({ message: 'created' })
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.put('/books/:bid/chapters/:cid', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.bid)
// 		if (book) {
// 			let chapters = await book.getChapters({ where: { id: req.params.cid } })
// 			let chapter = chapters.shift()
// 			if (chapter) {
// 				await chapter.update(req.body)
// 				res.status(202).json({ message: 'accepted' })
// 			}
// 			else {
// 				res.status(404).json({ message: 'not found' })
// 			}
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

// app.delete('/books/:bid/chapters/:cid', async (req, res) => {
// 	try {
// 		let book = await Book.findById(req.params.bid)
// 		if (book) {
// 			let chapters = await book.getChapters({ where: { id: req.params.cid } })
// 			let chapter = chapters.shift()
// 			if (chapter) {
// 				await chapter.destroy(req.body)
// 				res.status(202).json({ message: 'accepted' })
// 			}
// 			else {
// 				res.status(404).json({ message: 'not found' })
// 			}
// 		}
// 		else {
// 			res.status(404).json({ message: 'not found' })
// 		}
// 	}
// 	catch (e) {
// 		console.warn(e)
// 		res.status(500).json({ message: 'server error' })
// 	}
// })

app.listen(8080)