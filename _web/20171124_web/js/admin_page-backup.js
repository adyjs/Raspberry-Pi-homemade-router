
var prevClick = {
	page : null,
	pageID : null,
	settingBtn : null
}

window.onload = function(){
	document.getElementById("lang").addEventListener("change" , changeLanSidebar , false);
	var infoContainer = document.getElementById("info-container");
	document.getElementById("sidebar").addEventListener("click" , sideItems , false);
	document.getElementById("info-container").addEventListener("click" , settingItem , false);
	itemSidebar.getItemPage("net-status");
}


function sideItems(e){
	var targetID = e.target.id;
	var tagName = e.target.tagName;
	prevClick.PageID = targetID;
	if(targetID && tagName === "LI"){
		itemSidebar.getItemPage(targetID);		
	}
}

function settingItem(e){
	var btnID = e.target.id;
	var tagName = e.target.tagName;
	if(btnID && tagName == "BUTTON"){
		settingPageObj.getSettingPage(btnID);
	}
}



var settingPageObj = (function(){
	var itemBtnLock = false;
	var leaseLock = false;
	var target = "";
	var newTitle = "";
	var self = this;
	return {
		ajaxLocker : {
			getInfo : function(){
				return itemBtnLock;
			},
			locked : function(){
				itemBtnLock = true;
			},
			unLock : function(){
				itemBtnLock = false;
			}
		},
		getSettingPage : function(id){
			if(id && (this.ajaxLocker.getInfo() === false)){
				switch (id){
					case "ssid-modify" :{
						this.getSettingPageAjax("ssid_modify.php");
						break;
					};
					case "ssid-broadcasting" :{
						this.getSettingPageAjax("ssid_broadcast_option.php");
						break;
					};
					case "service" :{
						this.getSettingPageAjax("service_option.php");
						break;
					};

					/*底下的 case 都是觸發 setting submit 的按鈕事件*/
					case "modify-ssid-submit" : {
						var newSSID = document.getElementById("modified-ssid").value;
						this.settingSubmit.overlayOn();
						$.post( "ssid_modify_submit.php" , { ssid: newSSID})
							.done(function(data , textStatus){
								if( data && textStatus === "success"){
									try{
										document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , data);
									}
									catch(e){}
								}
							})
							.fail(function(jqAjax , textStatus){
								if(textStatus){
									settingPageObj.settingStage.loaderOff();
									var errorText = "<table>\
														<tr>\
															<td>Some error occurs , please check and try again.</td>\
														</tr>\
													</table>";
									document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , errorText);
								}
							})
							.always(function(){
								settingPageObj.settingSubmit.overlayOff();
							});
						break;
					};
					case "ssid-broadcasting-option-submit" : {
						var optionValue = document.getElementById("broadcast-option-select").value;
						this.settingSubmit.overlayOn();
						$.post( "ssid_broadcasting_option_submit.php" , { broadcastOption: optionValue})
							.done(function(data , textStatus){
								if( data && textStatus === "success"){
									try{
										document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , data);
									}
									catch(e){}
								}
							})
							.fail(function(jqAjax , textStatus){
								if(textStatus){
									settingPageObj.settingStage.loaderOff();
									var errorText = "<table>\
														<tr>\
															<td>Some error occurs , please check and try again.</td>\
														</tr>\
													</table>";
									document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , errorText);
								}
							})
							.always(function(){
								settingPageObj.settingSubmit.overlayOff();
							});
						break;
					};
					case "service-option-submit" : {
						var hostapdOptionValue = document.getElementById("hostpad-service-option-select").value;
						var iscdhcpserverOptionValue = document.getElementById("isc-dhcp-server-service-option-select").value;
						
						this.settingSubmit.overlayOn();
						$.post( "service_option_submit.php" , { hostapd: hostapdOptionValue , iscdhcpserver: iscdhcpserverOptionValue})
							.done(function(data , textStatus){
								if( data && textStatus === "success"){
									try{
										document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , data);
									}
									catch(e){}
								}
							})
							.fail(function(jqAjax , textStatus){
								if(textStatus){
									settingPageObj.settingStage.loaderOff();
									var errorText = "<table>\
														<tr>\
															<td>Some error occurs , please check and try again.</td>\
														</tr>\
													</table>";
									document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , errorText);
								}
							})
							.always(function(){
								settingPageObj.settingSubmit.overlayOff();
							});
						break;
					};
				}
			}
		},
		settingStage : {
			cleaner : function(){
				document.getElementById("setting-stage").innerHTML = "";
			},
			loaderOn : function(){
				document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , "<img id=\"dhcp-client-ajax-loader\" src=\"./image/oval.svg\">");
			},
			loaderOff : function(){
				document.getElementById("setting-stage").removeChild(document.getElementById("dhcp-client-ajax-loader"))
			}
		},
		settingSubmit : {
			overlayOn : function(){
				document.body.insertAdjacentHTML("afterbegin" , "<div id=\"overlay\"></div>");
				var settingTable = document.querySelectorAll(".setting-class");
				for(var i=0 ; i<settingTable.length ; i++){
					document.getElementById("setting-stage").removeChild(settingTable[i]);
				}
			},
			overlayOff : function(){
				document.body.removeChild(document.getElementById("overlay"));
			}
		},
		getSettingPageAjax : function(target){
			prevClick.SettingBtn = target;
			this.ajaxLocker.locked();
			this.settingStage.cleaner();
			this.settingStage.loaderOn();
			$.ajax({
				method:"GET",
				url:target,
				dataType:"text"
			})
			.done(function(data , textStatus){
				if( data && textStatus === "success"){
					try{
						settingPageObj.settingStage.loaderOff();
						document.getElementById("setting-stage").insertAdjacentHTML('beforeend' , data);
						mainPageContent(target);
					}
					catch(e){}
				}
			})
			.fail(function(ajax , textStatus){
				if(textStatus){
					settingPageObj.settingStage.loaderOff();
					var errorText = "<table>\
										<tr>\
											<td>Some error occurs , please check and try again.</td>\
										</tr>\
									</table>";
					document.getElementById("setting-stage").insertAdjacentHTML("beforeend" , errorText);
				}
			})
			.always(function(){
				settingPageObj.ajaxLocker.unLock();

			});

		}

	}
})();



var itemSidebar = (function(){
	var itemBtnLock = false;
	var leaseLock = false;
	var target = "";
	var newTitle = "";
	var infoContainer = document.getElementById("info-container");

	return {
		ajaxLocker : {
			getInfo : {
				itemBtnLockInfo : function(){
					return itemBtnLock;
				},
				leaseLock : function(){
					return leaseLock;
				}
			},
			locked : {
				itemBtn : function(){
					itemBtnLock = true;
				},
				lease : function(){
					leaseLock = true;
				}
			},
			unLock : {
				itemBtn : function(){
					itemBtnLock = false;
				},
				lease : function(){
					leaseLock = false;
				}
			}
		},

		getItemPage : function(id){
			if(itemSidebar.ajaxLocker.getInfo.itemBtnLockInfo() === false){
				switch (id){
					case "net-status":{
						newTitle = document.getElementById(id).textContent;
						itemSidebar.sidebarItemAjax( "net_status.php" , newTitle);
						itemSidebar.ajaxLocker.locked.itemBtn();
						break;
					};
					case "pi-router":{
						newTitle = document.getElementById(id).textContent;
						itemSidebar.sidebarItemAjax( "pi_router.php" , newTitle);
						itemSidebar.ajaxLocker.locked.itemBtn();
						break;
					};
					case "setting":{
						newTitle = document.getElementById(id).textContent;
						itemSidebar.sidebarItemAjax( "setting.php" , newTitle);
						itemSidebar.ajaxLocker.locked.itemBtn();
						break;
					};
					default:{
						break;
					}
				}
			}
		},
		pageInfoCleaner : function(newTitle){
			document.getElementById("info-container").innerHTML = "";
			document.getElementById("title").innerHTML = "";
			document.getElementById("title").innerHTML = newTitle;
		},
		sidebarItemAjax : function(target , newTitle){

			itemSidebar.pageInfoCleaner(newTitle);
			$.ajax({
				method:"GET",
				url:target,
				dataType:"text"
			})

			.done(function(data , textStatus){
				if( data && (textStatus === "success") ){
					prevClick.Page = target;
					try{
						infoContainer.insertAdjacentHTML("beforeend" , data);
						mainPageContent(target);
						if( (target === "pi_router.php")  &&  !(itemSidebar.ajaxLocker.getInfo.leaseLock()) ){
								itemSidebar.ajaxLocker.locked.lease();
								itemSidebar.leaseAjax();					
						}
					}
					catch(e){}
				}
			})

			.fail(function(jqxhr , textStatus){
				if(textStatus){
					var errorText = "<h2>Some error occurs , please check and try again.</h2>";
					document.getElementById("info-container").insertAdjacentHTML("beforeend" , errorText);
				}
			})

			.always(function(){
				itemSidebar.ajaxLocker.unLock.itemBtn();
			})
		},
		leaseAjax : function(){
			$.ajax({
				method:"GET",
				url:"lease_info.php",
				dataType:"text"
			})
			.done(function(data , textStatus){
				if( data && (textStatus === "success") ){
					try{
						document.getElementById("info").removeChild(document.getElementById("dhcp-client-ajax-loader"));
						itemSidebar.leaseParser(data);
					}
					catch(e){}
				}
			})
			.fail(function(ajax , textStatus){
				if(textStatus){
					var errorText = "<h2>Some error occurs , please check and try again.</h2>";
					document.getElementById("info-container").insertAdjacentHTML("beforeend" , errorText);
				}
			})
			.always(function(){
				itemSidebar.ajaxLocker.unLock.lease();
			})
		},
		leaseParser : function(lease){
			var infoContainer = document.getElementById("info");
			var pattern = /lease\s\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s\{([^}]+)\}/gm;
			var result = lease.match(pattern);
			
			/*var bindPattern = /\:\d{2}.+\s+binding state (active|free)/gm;*/
			var bindPattern = /\:\d{2}.+\s+binding state (active)/gm;
			var bindResult = lease.match(bindPattern);

			if(bindResult && bindResult[0].indexOf("active") >= 0){
				infoContainer.insertAdjacentHTML("beforeend" , "<table id=\"clients-list\"></table>");
				var clientTable = document.getElementById("clients-list");
				for(var i=0 ; i<result.length ; i++){
					var client = result[i];
					var bindPattern = /\:\d{2}.+\s+binding state (active|free)/gm;
					var bindResult = client.match(bindPattern);
					
					if(bindResult && bindResult[0].indexOf("active") >= 0){
					
						var hostname = "Unknown";
						var hostnamePattern = /client-hostname \".+\"/g;
						var hostnameResult = client.match(hostnamePattern);
						if(hostnameResult){
							hostname = hostnameResult[0];
							hostname = hostname.substring( hostname.indexOf('"')+1, (hostname.length-1));
						}

						var mac = "";
						var macPattern = /([a-zA-Z0-9]{2}\:[a-zA-Z0-9]{2}\:[a-zA-Z0-9]{2}\:[a-zA-Z0-9]{2}\:[a-zA-Z0-9]{2}\:[a-zA-Z0-9]{2})/g;
						var macResult = client.match(macPattern);
						if(macResult){
							mac = macResult[0];
						}

						var ip = "";
						var ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
						var ipResult = client.match(ipPattern);
						if(ipResult){
							ip = ipResult[0];
						}
						var start = "";
						var startPattern = /starts.+/g;
						var startResult = client.match(startPattern);
						if(startResult){
							start = client.match(startPattern)[0];
							start = start.substring(start.length-24,start.length);
						}
						
						var end = "";
						var endPattern = /ends.+/g;
						var endResult = client.match(endPattern);
						if(endResult){
							end = client.match(endPattern)[0];
							end = end.substring(end.length-24,end.length);
						}
/*
						var start = "";
						var startPattern = /starts\s\d\s(\d{4}\/\d{2}\/\d{2})\s(\d{2}\:\d{2}\:\d{2})/g;
						var startResult = client.match(startPattern);
						if(startResult){
							start = client.match(startPattern)[0];
							start = start.substring(9,start.length);
						}
						
						var end = "";
						var endPattern = /ends\s\d\s(\d{4}\/\d{2}\/\d{2})\s(\d{2}\:\d{2}\:\d{2})/g;
						var endResult = client.match(endPattern);
						if(endResult){
							end = client.match(endPattern)[0];
							end = end.substring(18,end.length);
						}
*/
						var duration = start+" ~ \n"+end;
						var list = "<tr><td>"+hostname+"</td><td>"+ip+"</td><td>"+mac+"</td><td>"+duration+"</td></tr>";
						clientTable.insertAdjacentHTML("beforeend" , list);
					}
				}
			}
			else{
				var noRelatedInfo = "<table><tr><td>No Related Info.</td></tr></table>";
				infoContainer.insertAdjacentHTML("beforeend" , noRelatedInfo);
			}
		}
	};
})();



function changeLanSidebar(e){
  i18next.changeLanguage(e.target.value);
  updateContent();
  mainPageManualUpdate();
}

function updateContent(){
	var currentLanguage = i18next.language.toString();
	try{
		var target = document.querySelectorAll("#sidebar li");
		var li_data = i18next.store.data[currentLanguage].translation.sidebar.li;
		for(var i=1 ; i<target.length ; i++){
			target[i].innerHTML = li_data[i];
		}
	}
	catch(e){}
}


i18next.init({
  lng: 'tw',
  debug: false,
  resources: {
    tw: {
      translation: {
		sidebar : {
			li : {
				"1" : '<img src="./image/network-status.svg">網路狀態',
				"2" : '<img src="./image/pi.svg">樹莓派路由器',
				"3" : '<img src="./image/settings.svg">設定',
				"4" : '<img src="./image/logout.svg">登出<form action="./logout.php" method="post"><input id="logout-btn" type="submit" name="logout-submit" value=""></form>'
			},
		},
		main : {
			net_status : {
				h2 : {
					"0" : "廣域網路",
					"1" : "ISP 閘道器網路介面",
					"2" : "樹莓派網路介面"
				},
				td : {
					"0" : "對外網路位址",
					"1" : "網路狀態",
					"2" : "網路位址",
					"3" : "MAC",
					"4" : "網路狀態",
					"5" : "網路介面",
					"6" : "網路位址",
					"7" : "MAC",
				},
			},
			pi_router : {
				h2 : {
					"0" : "無線存取點路由器",
					"1" : "DHCP 位址分配表"
				},
				td : {
					"0" : "狀態",
					"1" : "無線網路服務名稱",
					"2" : "網路位址",
					"3" : "MAC",
				},
			},
			setting : {
				h2 : {
					"0" : "設定選項"
				},
				button : {
					"0" :"修改無線網路服務名稱",
					"1" :"無線網路服務名稱顯示選項",
					"2" :"服務程序"
				}
			}
		},
		setting_option : {
			ssid_modify : {
				h2 : {
					"0" : "修改無線網路服務名稱"
				},
				td : {
					"0" : "目前無線網路服務名稱為",
					"1" : "更改無線網路服務名稱為"
				},
				button : {
					"0" : "執行設定"
				}
			},
			ssid_broadcast_option : {
				h2 : {
					"0" : "無線網路服務名稱顯示設定"
				},
				td : {
					"0" : "目前無線網路服務名稱顯示設定",
					"1" : "無線網路服務名稱顯示選項"
				},
				option :{
					"0" : "廣播 SSID",
					"1" : "隱藏 SSID (可連接)"
				},
				button : {
					"0" : "執行設定"
				}
			},
			service : {
				h2 : {
					"0" : "運行服務"
				},
				td : {
					"0" : "Hostadp 服務選項",
					"1" : "ISC-DHCP-Server 服務選項"
				},
				option :{
					"0" : "啟動服務",
					"1" : "終止服務",
					"2" : "重新啟動服務",
					"3" : "啟動服務",
					"4" : "終止服務",
					"5" : "重新啟動服務"
				},
				button : {
					"0" : "執行設定"
				}
			}
		}
      }
    },
    en: {
      translation: {
		sidebar : {
			li : {
				"1" : '<img src="./image/network-status.svg">Network Status',
				"2" : '<img src="./image/pi.svg">Rasp-Pi Router',
				"3" : '<img src="./image/settings.svg">Setting',
				"4" : '<img src="./image/logout.svg">Logout<form action="./logout.php" method="post"><input id="logout-btn" type="submit" name="logout-submit" value=""></form>'
			},
		},
		main : {
			net_status : {
				h2 : {
					"0" : "WAN",
					"1" : "ISP Gateway Network Interface",
					"2" : "Rasp-Pi Network Interface"
				},
				td : {
					"0" : "Public IP",
					"1" : "Network Status",
					"2" : "IP",
					"3" : "MAC",
					"4" : "Network Status",
					"5" : "Network Interface",
					"6" : "IP",
					"7" : "MAC",
				},
			},
			pi_router : {
				h2 : {
					"0" : "Wireless AP & Router",
					"1" : "DHCP Clients"
				},
				td : {
					"0" : "Status",
					"1" : "SSID",
					"2" : "IP",
					"3" : "MAC",
				},
			},
			setting : {
				h2 : {
					"0" : "Setting Options"
				},
				button : {
					"0" :"Modify SSID",
					"1" :"SSID Broadcasting Options",
					"2" :"Service Process"
				}
			}
		},
		setting_option : {
			ssid_modify : {
				h2 : {
					"0" : "Modify SSID"
				},
				td : {
					"0" : "Current SSID",
					"1" : "Modify SSID to "
				},
				button : {
					"0" : "Submit"
				}
			},
			ssid_broadcast_option : {
				h2 : {
					"0" : "SSID Broadcasting Options"
				},
				td : {
					"0" : "Current SSID Broadcasting Setting",
					"1" : "SSID Broadcasting Setting Option"
				},
				option :{
					"0" : "Broadcasting SSID",
					"1" : "Hide SSID (Connectable)"
				},
				button : {
					"0" : "Submit"
				}
			},
			service : {
				h2 : {
					"0" : "Services"
				},
				td : {
					"0" : "Hostadp Service Option",
					"1" : "ISC-DHCP-Server Service Option"
				},
				option :{
					"0" : "Start Service",
					"1" : "Stop Service",
					"2" : "Restart Service",
					"3" : "Start Service",
					"4" : "Stop Service",
					"5" : "Restart Service"
				},
				button : {
					"0" : "Submit"
				}
			}
		}
      }
    }
  }
}, function(err, t) {
  updateContent();
});


function mainPageManualUpdate(){
	mainPageContent(prevClick.Page);
	document.getElementById("title").innerHTML = document.getElementById(prevClick.PageID).textContent;
	if( prevClick.Page === "setting.php"){
		mainPageContent(prevClick.SettingBtn);
	}
}

function mainPageContent(targetPage){

	switch(targetPage){
		case "net_status.php" :{
			mainPageContentUpdate_NETSTATUS()
			break;
		};
		case "pi_router.php" :{
			mainPageContentUpdate_PIROUTER();
			break;
		};
		case "setting.php" :{
			mainPageContentUpdate_SETTING();
			break;
		};
		case "ssid_modify.php" :{
			settingPageUpdate_MODIFY();
			break;
		}
		case "ssid_broadcast_option.php" :{
			settingPageUpdate_SSIDBROADCAST();
			break;
		}
		case "service_option.php" :{
			settingPageUpdate_SERVICE();
			break;
		}

	}
	//mainPageContentUpdate();
}

function mainPageContentUpdate_NETSTATUS(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#info-container h2.sub-title");
		var h2_data = i18next.store.data[currentLanguage].translation.main.net_status.h2;
		for(var i=0 ; i<h2Target.length ; i++){
			h2Target[i].textContent = h2_data[i];
		}

		var tdTarget = document.querySelectorAll("#info-container td.td-item-name");
		var td_data = i18next.store.data[currentLanguage].translation.main.net_status.td;
		for(var i=0 ; i<tdTarget.length ; i++){
			tdTarget[i].textContent = td_data[i];
		}
	}catch(e){}
}

function mainPageContentUpdate_PIROUTER(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#info-container h2.sub-title");
		var h2_data = i18next.store.data[currentLanguage].translation.main.pi_router.h2;
		for(var i=0 ; i<h2Target.length ; i++){
			h2Target[i].textContent = h2_data[i];
		}
		var tdTarget = document.querySelectorAll("#info-container td.td-item-name");
		var td_data = i18next.store.data[currentLanguage].translation.main.pi_router.td;
		for(var i=0 ; i<tdTarget.length ; i++){
			tdTarget[i].textContent = td_data[i];
		}
	}catch(e){}
}

function mainPageContentUpdate_SETTING(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#info-container h2.sub-title")[0];
		var h2_data = i18next.store.data[currentLanguage].translation.main.pi_router.h2["0"];
		h2Target.textContent = h2_data;

		var buttonTarget = document.querySelectorAll("#info-container button");
		var button_data = i18next.store.data[currentLanguage].translation.main.setting.button;
		for(var i=0 ; i<buttonTarget.length ; i++){
			buttonTarget[i].textContent = button_data[i];
		}
	}catch(e){}
}

function settingPageUpdate_MODIFY(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#setting-stage h2.sub-title")[0];
		var h2_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_modify.h2["0"];
		h2Target.textContent = h2_data;

		var tdTarget = document.querySelectorAll("#setting-stage td.td-item-name");
		var td_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_modify.td;
		for(var i=0; i<tdTarget.length ; i++){
			tdTarget[i].textContent = td_data[i];
		}

		var buttonTarget = document.querySelectorAll("#setting-stage button")[0];
		var button_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_modify.button["0"];
		buttonTarget.textContent = button_data;
	}catch(e){}
}

function settingPageUpdate_SSIDBROADCAST(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#setting-stage h2.sub-title")[0];
		var h2_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_broadcast_option.h2["0"];
		h2Target.textContent = h2_data;

		var tdTarget = document.querySelectorAll("#setting-stage td.td-item-name");
		var td_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_broadcast_option.td;
		for(var i=0; i<tdTarget.length ; i++){
			tdTarget[i].textContent = td_data[i];
		}

		var optionTarget = document.querySelectorAll("#setting-stage option");
		var option_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_broadcast_option.option;
		for(var i=0; i<optionTarget.length ; i++){
			optionTarget[i].textContent = option_data[i];
		}

		var buttonTarget = document.querySelectorAll("#setting-stage button")[0];
		var button_data = i18next.store.data[currentLanguage].translation.setting_option.ssid_broadcast_option.button["0"];
		buttonTarget.textContent = button_data;
	}catch(e){}
}

function settingPageUpdate_SERVICE(){
	var currentLanguage = i18next.language.toString();
	try{
		var h2Target = document.querySelectorAll("#setting-stage h2.sub-title")[0];
		var h2_data = i18next.store.data[currentLanguage].translation.setting_option.service.h2["0"];
		h2Target.textContent = h2_data;

		var tdTarget = document.querySelectorAll("#setting-stage td.td-item-name");
		var td_data = i18next.store.data[currentLanguage].translation.setting_option.service.td;
		for(var i=0; i<tdTarget.length ; i++){
			tdTarget[i].textContent = td_data[i];
		}

		var optionTarget = document.querySelectorAll("#setting-stage option");
		var option_data = i18next.store.data[currentLanguage].translation.setting_option.service.option;
		for(var i=0; i<optionTarget.length ; i++){
			optionTarget[i].textContent = option_data[i];
		}

		var buttonTarget = document.querySelectorAll("#setting-stage button")[0];
		var button_data = i18next.store.data[currentLanguage].translation.setting_option.service.button["0"];
		buttonTarget.textContent = button_data;
	}catch(e){}
}