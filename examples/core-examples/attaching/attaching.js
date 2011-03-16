/**
@example_title Hello world
@example_order 1
@example_html
    <div id='test' style='width: 50%; height: 100px; background: #EEE; position:relative'>#test</div>
    <script src="/src/pkg/uki.js"></script>
    <script src="attaching.js"></script>
*/

uki({
    view: 'Button',
    pos: 'l:50% t:40px w:200px ml:-100px',
    label: 'uki is awesome!',
    tabIndex: 1
}).attach( document.getElementById('test') );

uki('Button[text~=awesome]').on('click', function(e) {
    alert(this.label());
});
