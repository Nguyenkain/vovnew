<?php
define("ABS_PATH", dirname(__FILE__));
// Start the session
session_start();
if (!isset($_SESSION['logged_in']) || (isset($_SESION['logged_in']) && $_SESSION['logged_in'] == 0)) {
    $_SESSION['logged_in'] = 0;
}
?>
<!DOCTYPE html>

<html>
<head>
    <title>Đánh dấu tắc đường</title>
    <!---JQUERY MUST BE REFERENCED FOR DMLMAP---->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
    <!---JQUERY REFERENCE ENDS FOR DMLMAP-->
</head>

<body>
<!-- TEXT STARTS -->
<?php
$output = 'Error';

$output = '
				<div style="text-align: center;">
					<h2>Nhập dữ liệu tắc đường</h2>
					<br />
					<div class="row" style="text-align: left">
                        <div class="col-lg-9 col-lg-offset-3">
                            <h3>Các biểu tượng cần lưu ý</h3>
                        </div>
                        <div class="col-lg-3 col-lg-offset-3">
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-success fontawesome-screenshot"></div> : Đi đến điểm được chọn
                            </div>
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-primary fontawesome-map-marker"></div> : Đánh dấu sự kiện
                            </div>
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-primary fontawesome-minus"></div> : Đánh dấu đường
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-primary fa fa-square-o"></div> : Đánh dấu khu vực
                            </div>
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-primary fontawesome-map-marker"></div> : Đánh dấu sự kiện
                            </div>
                            <div class="col-lg-12" style="padding: 5px 0">
                                <div class="btn btn-danger fontawesome-trash"></div> : Xóa điểm
                            </div>
                        </div>
                    </div>
				</div>
			';
echo $output . "<hr />";
echo '<div id="myMap1Edit" style="display: none;">1</div>';
?>
<!-- TEXT ENDS -->

<!-- INCLUDES DML MAP STARTS-->
<?php
include ABS_PATH . '/dmlmap/dmlmap.php';
?>
<!-- INCLUDES DML MAP ENDS-->

<!---BOOTSTRAP REFERENCE STARTS FOR DMLMAP-->
<link href="//netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet"/>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- DML MAP SCRIPTS -->
<script src="dmlmap/dmlmap.js"></script>
<link href="dmlmap/css/bootstrap.css" rel="stylesheet" type="text/css"/>
<link href="dmlmap/css/custom.css" rel="stylesheet" type="text/css"/>
</body>
</html>