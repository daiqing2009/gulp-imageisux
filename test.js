/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* eslint-env mocha */
'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var zhitu = require('./');
var testSize;

it('should minify images', function (cb) {
	this.timeout(40000);

	var stream = zhitu({enableWebp:false});

	stream.once('data', function (file) {
		testSize = file.contents.length;
		console.log("size comparison:",fs.statSync('fixture.png').size, file.contents.length);
		assert(file.contents.length < fs.statSync('fixture.png').size);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		path: path.join(__dirname, 'fixture.png'),
		contents: fs.readFileSync('fixture.png')
	}));

	stream.end();
});

it('should support webp file',function(cb){
	this.timeout(40000);

	var stream = zhitu({enableWebp:true});

	stream.once('data', function (file) {
		testSize = file.contents.length;
		console.log("size comparison:",fs.statSync('fixture.png').size, file.contents.length);
		assert(file.contents.length < fs.statSync('fixture.png').size);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		path: path.join(__dirname, 'fixture.png'),
		contents: fs.readFileSync('fixture.png')
	}));

	stream.end();
});

it('should skip unsupported images', function (cb) {
	var stream = zhitu({});

	stream.once('data', function (file) {
		assert.strictEqual(file.contents, null);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		path: path.join(__dirname, 'fixture.bmp')
	}));

	stream.end();
});
