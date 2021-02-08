<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Searcb OMDb</title>

    <!-- Fonts -->

    <!-- Styles -->
    <link rel="stylesheet" href="{{ URL::asset('css/select2.min.css') }}"/>
    <link rel="stylesheet" href="{{ URL::asset('css/search.css') }}"/>

</head>
<body>
<h1>Search OMDb</h1>

<!-- select2 search box -->
<div>
    <select class="select2" name="state">
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
    </select>
    <button id="btnSearch" onClick="javascript:search($('.select2').val())">Search!</button>
</div>

<!-- display table -->
<div style="display:none" id="divDisplayTable">
    <table class="displayTable">
        <thead>
            <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Runtime</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
            <tr>
                <td id="tdPaginator" colspan="3">
                    <div id="divPaginator">
                        <button onClick="startPage()">&laquo;</button>
                        <button onClick="decrementPage()">&lsaquo;</button>
                        <input onBlur="gotoPage()" id="inpPageNo" type="text" value="1">
                        of
                        <input id="inpTotalPageNo" type="text" value="" disabled="disabled"/>
                        <button onClick="incrementPage()">&rsaquo;</button>
                        <button onClick="endPage()">&raquo;</button>
                    </div>
                </td>
            </tr>
        </tfoot>
    </table>
</div>

<!-- error div -->
<div style="display:none" id="divError">
    <div id="divError2"></div>
</div>

<!-- include javascript -->
<script src="{{ URL::asset('js/jquery-3.5.1.min.js') }}"></script>
<script src="{{ URL::asset('js/select2.min.js') }}"></script>
<script src="{{ URL::asset('js/search.js') }}"></script>

<!-- include API key from env('OMDB_API') -->
<script>
    let api_key = '{{ $api_key }}';
</script>
</body>
</html>
