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
    <script src="//code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
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
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 style="margin-left: 25%;font-size: 24px;" class="panel-title">Các biểu tượng cần lưu ý  <span class="clickable"><i class="fa fa-chevron-up"></i></span></h3>
                            </div>
                            <div class="panel-body">
                                <div class="row">
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
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!-- DML MAP SCRIPTS -->
<script src="dmlmap/dmlmap.js"></script>
<link href="dmlmap/css/bootstrap.css" rel="stylesheet" type="text/css"/>
<link href="dmlmap/css/custom.css" rel="stylesheet" type="text/css"/>

<script>
    $(document).on('click', '.panel-heading span.clickable', function(e){
        var $this = $(this);
        if(!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    })
</script>
</body>
</html>