<?php include "config.php"; ?>
	<!-- MAP PANEL STARTS -->
	<div id="Map1idHolder" style="display:none;"></div>
	<div id="MapScriptHolder"></div>
	<div id="dmlMapContainer">
		<div id="Repeater1Container">
			<div class="row">
				<div id="Repeater1Map">
					<div id="map" class="container-fluid"></div>
					<input id="pac-input" class="controls" type="text" placeholder="Search Box">
				</div>
			</div>
		</div>
	</div>
	<!-- MAP PANEL ENDS -->

	<!-- MAP ACTIVATION API PANEL STARTS -->
	<div id="dmlApiDiv" class="container" style="text-align: center; display: none;">
		<div id="dmlApiEnterPanel">
			<h3>HÃY CÀI ĐẶT API MAP</h3>
			<p>Để lấy key hãy vào <a href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key"
					target="_blank">đây</a> và chọn <b>GET A KEY</b>, ngoài ra nếu không nhập thì sẽ sử dụng key mặc định cài đặt ở config</p>
			<input id="dmlTxtApiKey" type="text" value="<?php echo MAP_API ?>" />
			<h3>
				<div id="dmlBtnSaveApiKey" onclick="dmlCreateMap();" class="btn btn-success">Lưu</div>
			</h3>
		</div>
		<div id="dmlApiKeyError"></div>
	</div>
	<div style="clear: both;"></div>
	<!-- MAP ACTIVATION PANEL ENDS -->

	<!--SETTINGS MODAL POPUP STARTS-->
	<div id="mySettings" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 id="dmlPnlSettingsTitle" class="modal-title">Settings Panel</h4>
				</div>
				<div id="EssSettingsModalBody" class="modal-body">
				</div>
				<div class="modal-footer">
					<input id="BtnReset" type="button" class="btn btn-danger pull-left" onclick="ResetControl();" value="Reset" />
					<input id="BtnSettingsSave" type="button" class="btn btn-success" value="Save" onclick="SaveSettings();" />
					<div id="dmlSelectedIconMarkerId" style="display:none;"></div>
				</div>
			</div>
		</div>
		<div id="mySettingSaveStart" style="display: none;"></div>
	</div>
	<!---SETTINGS MODAL POPUP ENDS-->

	<!--NON CONTENT AND HOVER BUTTON STARTS-->
	<div id="BtnSettings" data-target="#mySettings" data-toggle="modal" class="btn btn-primary fontawesome-cogs " onclick="FillSettings();"
		style="display: none;"> Map Settings</div>
	<!--NON CONTENT AND HOVER BUTTON STARTS-->
	