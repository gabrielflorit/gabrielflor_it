var projects = [
	{
		href: 'http://bostonglobe.com/2013/02/12/main/tJSQtw32Gty7xSicexBzfM/story.html',
		title: 'State of the Union addresses - a quiz',
		img: 'sotuquiz',
		date: 'Feb. 12, 2013'
	},
	{
		href: 'http://www.bostonglobe.com/2013/02/08/main/NMg9OejQo82CsJUR1maUeI/story.html',
		title: 'Measuring the snowfall in the Northeast',
		img: 'nemo',
		date: 'Feb. 8, 2013'
	},
	{
		href: 'http://www.bostonglobe.com/2013/01/30/mai/yWQCjhK7lyBaqgqFrakr1M/story.html',
		title: "'Women' a central theme in Menino's speech",
		img: 'meninospeech',
		date: 'Jan. 30, 2013'
	},
	{
		href: 'http://www.bostonglobe.com/2013/01/21/main/4kXqydaTvcSf8WdIt6FlhM/story.html#2013freedom',
		title: 'Inaugural language',
		img: 'inauguraladdresses',
		date: 'Jan. 23, 2013'
	},
	{
		href: 'http://www.bostonglobe.com/Page/Boston/2011-2020/WebGraphics/Metro/BostonGlobe.com/2012/11/bgVideo5/video.xml',
		title: 'Growing up in Bowdoin-Geneva',
		img: '68blocksvideo',
		date: 'Dec. 20, 2012'
	},
	{
		href: 'http://bostonglobe.com/metro/2012/12/17/855kEpZMsdHNXsnfMntmHJ/igraphic.html',
		title: 'Bowdoin-Geneva racial distribution',
		img: '68blocksdotmaps',
		date: 'Dec. 17, 2012'
	},
	{
		href: 'http://bostonglobe.com/2012/10/26/sandy/HEMaUSbjMXMQ0TIcTxDTvL/story.html',
		title: 'Hurricane Sandy wind gust speed predictions',
		img: 'sandy',
		date: 'Oct. 26, 2012'
	},
	{
		href: 'http://bostonglobe.com/2012/10/03/debate/IccbCKe9W5r5R5bN5h1aeL/story.html',
		title: 'Terms of engagement',
		img: '2012debate',
		date: 'Oct. 3, 2012'
	},
	{
		href: 'http://www.bostonglobe.com/2012/09/24/schoolplans/t60CkakzBfOeO3IQkLzn8J/story.html',
		title: 'Overhauling the school assignment system',
		img: 'schoolplans',
		date: 'Sep. 24, 2012'
	},
	{
		href: 'http://www.bostonglobe.com/2012/09/22/scallops/ZhOnBwO0I5jyxWm1gjhDJO/story.html',
		title: 'How much water is in your scallop?',
		img: 'scallops',
		date: 'Sep. 9, 2012'
	},
	{
		href: 'http://www.bostonglobe.com/2012/09/07/obama-dnc/AD16UkEU7OFB2NbBw8TRkM/story.html',
		title: 'Obama stayed on-script at DNC',
		img: 'obamadnc',
		date: 'Sep. 7, 2012'
	},
	{
		href: 'http://bostonglobe.com/news/politics/2012/09/06/bill-clinton-libbed-some-his-most-memorable-lines-democratic-convention-speech/oHXPUYc1Txx4SKQCWi6TUO/igraphic.html',
		title: "Much of Clinton's DNC speech was improvised",
		img: 'clintondnc',
		date: 'Sep. 6, 2012'
	}
];

$(function() {

	var projectsHtml = '';
	var project;
	for (var i = 0; i < projects.length; i++) {
		project = projects[i];

		projectsHtml += '<article>';
		projectsHtml += '  <h6>' + project.date + '</h6>';
		projectsHtml += '  <h3><a href="' + project.href + '">' + project.title + '</a></h3>';
		projectsHtml += '  <div class="images">';
		projectsHtml += '    <a href="' + project.href + '">';
		projectsHtml += '      <img class="iphone lazy" src="../static/img/blank.gif" data-src="../static/img/' + project.img + '-iphone.png"></img>';
		projectsHtml += '    </a>';
		projectsHtml += '    <a href="' + project.href + '">';
		projectsHtml += '      <img class="ipad lazy" src="../static/img/blank.gif" data-src="../static/img/' + project.img + '-ipad.png"></img>';
		projectsHtml += '    </a>';
		projectsHtml += '  </div>';
		projectsHtml += '</article>';
	}

	var $projects = $('.projects');

	$projects.html(projectsHtml);

	var projectsResize = function() {

		// get the size of container
		var width = $projects.width();
		$('img.iphone', $projects)
			.width(317*width/1500);
		$('img.ipad', $projects).width(1024*width/1500);

	};
	projectsResize();

	$(window).resize(function() {
		projectsResize();
	});

	$('img.lazy').jail();


});




