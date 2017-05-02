const expect = require("chai").expect;
var chai = require('chai');
var spies = require('chai-spies');
var models = require("../models");
var Page = models.Page;
var User = models.User;
chai.use(spies);
chai.should();
chai.use(require('chai-things'));

describe('the Page model', function () {
  var page;
  before(function(){
    // page = Page.build();
    return Page.sync({ force: true })
  });

  describe('Virtuals', function () {
    before(function () {
      page = Page.build({
        title: 'foo',
        content: 'this is the __content__',
        tags: ['foo', 'bar']
      })
      // .then(function(createdPage) {
      //   page = createdPage;
      // })
    });

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function() {
        expect(page.route).to.equal('/wiki/' + page.urlTitle);
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function() {
        var html = '<p>this is the <strong>content</strong></p>\n';
        expect(page.renderedContent).to.equal(html);
      });
    });
  });

  describe('Class methods', function () {
    before(function (done) {
      page = Page.create({
        title: 'foo',
        content: 'bar',
        tags: 'testTag'
      })
      .then(function() {
        done()
      })
      .catch(done)
    });

    describe('findByTag', function () {
      it('gets pages with the search tag', function(done) {
        Page.findByTag('testTag')
        .then(function(pages) {
          expect(pages).to.have.lengthOf(1);
          done()
        })
        .catch(done)
      });
      it('does not get pages without the search tag', function(done) {
        Page.findByTag('baz')
        .then(function(pages) {
          expect(pages).to.have.lengthOf(0);
          done()
        })
        .catch(done)
      });
    });
  });

  describe('Instance methods', function () {
    var page1;
    var page2;
    var page3;
    before(function (done) {
      page1 = Page.build({
        title: 'page1',
        content: 'bar',
        tags: 'foo'
      })
      page2 = Page.build({
          title: 'page2',
          content: 'bar',
          tags: 'foo'
      })
      page3 = Page.build({
          title: 'page3',
          content: 'bar',
          tags: 'bax'
      })
      page1.save()
      .then(function() {
        return page2.save();
      })
      .then(function() {
        return page3.save();
      })
      .then(function() {
        done()
      })
      .catch(done)
    });

    describe('findSimilar', function () {
      it('never gets itself', function(done) {
        page1.findSimilar()
        .then(function(similarPages) {
          similarPages.should.not.include(page1);
          done();
        })
        .catch(done)
      });
      it('gets other pages with any common tags', function(done) {
        page1.findSimilar()
        .then(function(similarPages) {
          expect(similarPages[0].title).to.equal('page2');
          done();
        })
        .catch(done)
      });
      it('does not get other pages without any common tags', function(done) {
        page1.findSimilar()
        .then(function(similarPages) {
          similarPages.should.not.include(page3);
          done();
        })
        .catch(done)
      });
    });
  });

  describe('Validations', function () {
    var pageWithoutTitle;
    var pageWithoutContent;
    var pageWithInvalidStatus;

    before(function() {
      pageWithoutTitle = Page.build({
        content: 'bar',
        tags: 'foo'
      })
      pageWithoutContent = Page.build({
        title: 'bar',
        tags: 'foo'
      })
      pageWithInvalidStatus = Page.build({
        title: 'bar',
        content: 'foo',
        status: 'totes open'
      })
    })
    it('errors without title', function(done) {
      pageWithoutTitle.validate()
      .then(function(result) {
        expect(result).to.be.an('object');
        done();
      })
      .catch(done)
    });
    it('errors without content', function(done) {
      pageWithoutContent.validate()
      .then(function(result) {
        expect(result).to.be.an('object');
        done();
      })
      .catch(done)
    });
    it('errors given an invalid status', function(done) {
      pageWithInvalidStatus.validate()
      .then(function(result) {
        expect(result).to.be.an('object');
        done();
      })
      .catch(done)
    });
  });

  describe('Hooks', function () {
    before(function() {
      page = Page.build({
        title: 'title !',
        content: 'bar'
      })
    })

    it('it sets urlTitle based on title before validating', function(done) {
      expect(page.urlTitle).to.be.undefined;
      page.save()
      .then(function(){
        expect(page.urlTitle).to.equal('title_');
        done()
      })
      .catch(done)
    });
  });
});
