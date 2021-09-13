var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", game_tick=0, who_play_next=0, my_checkers=1, selected_checker=0, move=0, game_id=0; 
var me_conf_play=0,opp_conf_play=0, any_dialog_active=0, min_move_amount=0, h_state="", game_platform="";
g_board=[];
var players="", pending_player="",tm={};
var my_data={},opp_data={};
var g_process=function(){};
var load_list=[["sprite","desktop","objects[obj_name].x=-10;objects[obj_name].y=-10;","app.stage.addChild(objects[obj_name]);"],["sprite","play_button","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.play_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","app.stage.addChild(objects[obj_name]);"],["sprite","lb_button","objects[obj_name].x=170;objects[obj_name].y=10;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.lb_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;","app.stage.addChild(objects[obj_name]);"],["sprite","rules_button","objects[obj_name].x=340;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.rules_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","app.stage.addChild(objects[obj_name]);"],["sprite","preferences_button","objects[obj_name].x=500;objects[obj_name].y=10;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){main_menu.pref_button_down()};objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","app.stage.addChild(objects[obj_name]);"],["cont","main_buttons_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=75;objects[obj_name].sy=objects[obj_name].y=260;","objects[obj_name].addChild(objects.play_button);objects[obj_name].addChild(objects.lb_button);objects[obj_name].addChild(objects.rules_button);objects[obj_name].addChild(objects.preferences_button);app.stage.addChild(objects[obj_name]);"],["image","lb_bcg",""],["sprite","board","objects[obj_name].x=190;objects[obj_name].y=10;objects[obj_name].visible=false;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){game.mouse_down_on_board()};","app.stage.addChild(objects[obj_name]);"],["sprite","send_sticker_button","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);","objects[obj_name].pointerdown=function(){stickers.show_panel()};objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"],["sprite","giveup_button","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.show()};objects[obj_name].x=10;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);","objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"],["cont","game_buttons_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].ready=true;objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=610;objects[obj_name].sy=objects[obj_name].y=310;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.send_sticker_button);objects[obj_name].addChild(objects.giveup_button);app.stage.addChild(objects[obj_name]);"],["sprite","message_bcg","objects[obj_name].x=10;objects[obj_name].y=20;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","message_text","objects[obj_name]=new PIXI.BitmapText('', {font: '20px Century Gothic'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=150;objects[obj_name].x=100;objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",""],["cont","message_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=220;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.message_bcg);objects[obj_name].addChild(objects.message_text);app.stage.addChild(objects[obj_name]);"],["sprite","timer_bcg","objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","timer_text","objects[obj_name]=new PIXI.BitmapText('0:30', {font: '30px Century Gothic'});objects[obj_name].anchor.set(0.5,0.5);objects[obj_name].visible=true;objects[obj_name].sx=objects[obj_name].x=90;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;",""],["cont","timer_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].show=function(){this.childs.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.timer_bcg);objects[obj_name].addChild(objects.timer_text);app.stage.addChild(objects[obj_name]);"],["sprite","my_card_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","my_card_name","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=128;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","my_card_rating","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["block","my_card_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=50;objects[obj_name].sy=objects[obj_name].y=30;objects[obj_name].width=100.00009765625;objects[obj_name].height=90;",""],["cont","my_card_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=0;objects[obj_name].sy=objects[obj_name].y=0;","objects[obj_name].addChild(objects.my_card_bcg);objects[obj_name].addChild(objects.my_card_name);objects[obj_name].addChild(objects.my_card_rating);objects[obj_name].addChild(objects.my_card_avatar);app.stage.addChild(objects[obj_name]);"],["sprite","opp_card_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","opp_card_name","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=128;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","opp_card_rating","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=150;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["block","opp_card_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=50;objects[obj_name].sy=objects[obj_name].y=30;objects[obj_name].width=100.00009765625;objects[obj_name].height=90;",""],["cont","opp_card_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=600;objects[obj_name].sy=objects[obj_name].y=0;","objects[obj_name].addChild(objects.opp_card_bcg);objects[obj_name].addChild(objects.opp_card_name);objects[obj_name].addChild(objects.opp_card_rating);objects[obj_name].addChild(objects.opp_card_avatar);app.stage.addChild(objects[obj_name]);"],["image","mini_player_card",""],["array","checkers",24,"var num=n;objects[obj_name][num]=new PIXI.Sprite();objects[obj_name][num].visible=false;","var num=n;objects[obj_name][num].texture=game_res.resources.chk_quad_1_tex.texture;app.stage.addChild(objects[obj_name][num]);"],["sprite","selected_frame","objects[obj_name].visible=false;","app.stage.addChild(objects[obj_name]);"],["image","chk_quad_1_tex",""],["image","chk_quad_2_tex",""],["sprite","giveup_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","giveup_no","objects[obj_name].x=150;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.hide()};","objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"],["cont","giveup_dialog","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=250;objects[obj_name].sy=objects[obj_name].y=270;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.giveup_bcg);objects[obj_name].addChild(objects.giveup_yes);objects[obj_name].addChild(objects.giveup_no);app.stage.addChild(objects[obj_name]);"],["sprite","giveup_yes","objects[obj_name].x=30;objects[obj_name].y=70;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){giveup_menu.give_up()};","objects[obj_name].pointerover=function(){this.tint=0xff9999};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"],["image","pc_icon",""],["block","cur_move_text","objects[obj_name]=new PIXI.BitmapText('', {font: '30px Century Gothic'});objects[obj_name].anchor.set(0,0.5);objects[obj_name].x=32;objects[obj_name].y=430;objects[obj_name].base_tint=objects[obj_name].tint=0XD9D9D9;","app.stage.addChild(objects[obj_name]);"],["sprite","stop_bot_button","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].visible=false;objects[obj_name].pointerdown=function(){bot_game.stop()};objects[obj_name].x=objects[obj_name].sx=620;objects[obj_name].y=objects[obj_name].sy=370;objects[obj_name].base_tint=objects[obj_name].tint;app.stage.addChild(objects[obj_name]);","objects[obj_name].pointerover=function(){this.tint=0x66ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};"],["sprite","stickers_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","sticker_0","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_0'].texture;",""],["block","sticker_1","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_1'].texture;",""],["block","sticker_2","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_2'].texture;",""],["block","sticker_3","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=60;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_3'].texture;",""],["block","sticker_4","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_4'].texture;",""],["block","sticker_5","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_5'].texture;",""],["block","sticker_6","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_6'].texture;",""],["block","sticker_7","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_7'].texture;",""],["block","sticker_8","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_8'].texture;",""],["block","sticker_9","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_9'].texture;",""],["block","sticker_10","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_10'].texture;",""],["block","sticker_11","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=200;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_11'].texture;",""],["block","sticker_12","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=30;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_12'].texture;",""],["block","sticker_13","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=100;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_13'].texture;",""],["block","sticker_14","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=170;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_14'].texture;",""],["block","sticker_15","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=240;objects[obj_name].y=270;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].texture=game_res.resources['sticker_texture_15'].texture;",""],["cont","stickers_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].ready=true;objects[obj_name].sx=objects[obj_name].x=230;objects[obj_name].sy=objects[obj_name].y=60;","app.stage.addChild(objects[obj_name]);objects[obj_name].addChild(objects.stickers_bcg);objects[obj_name].addChild(objects.close_stickers);for (var z=0;z<16;z++) {objects[obj_name].addChild(objects['sticker_'+z]);objects['sticker_'+z].width=70;objects['sticker_'+z].height=70;objects['sticker_'+z].interactive=true;objects['sticker_'+z].buttonMode=true;const id=z;objects['sticker_'+id].pointerover=function(){this.tint=0xFF6666};objects['sticker_'+id].pointerout=function(){this.tint=this.base_tint};objects['sticker_'+id].pointerdown=function(){stickers.send(id)};}objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};"],["sprite","close_stickers","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=()=>{stickers.hide_panel()};objects[obj_name].x=270;objects[obj_name].y=21;","objects[obj_name].pointerover=function(){this.tint=0xff0000};objects[obj_name].pointerout=function(){this.tint=0xffffff};"],["block","cards_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;","for (let i=0;i<12;i++)objects[obj_name].addChild(objects.mini_cards[i]);app.stage.addChild(objects[obj_name]);"],["array","mini_cards",12,"var num=n;objects[obj_name][num]=new player_mini_card_class(0,0,num);",""],["sprite","back_button","objects[obj_name].x=690;objects[obj_name].y=310;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){cards_menu.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","app.stage.addChild(objects[obj_name]);"],["image","cards_bcg",""],["sprite","invite_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","invite_name","objects[obj_name]=new PIXI.BitmapText('', {font: '32px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=184;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFFFF;",""],["block","invite_rating","objects[obj_name]=new PIXI.BitmapText('', {font: '32px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=135;objects[obj_name].y=213;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","invite_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=70;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].width=130;objects[obj_name].height=130;",""],["cont","invite_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=260;objects[obj_name].sy=objects[obj_name].y=50;","objects[obj_name].addChild(objects.invite_bcg);objects[obj_name].addChild(objects.invite_avatar);objects[obj_name].addChild(objects.invite_name);objects[obj_name].addChild(objects.invite_rating);objects[obj_name].addChild(objects.invite_button);objects[obj_name].addChild(objects.invite_close);app.stage.addChild(objects[obj_name]);"],["sprite","invite_button","objects[obj_name].x=20;objects[obj_name].y=240;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.send_invite()};objects[obj_name].pointerover=function(){this.tint=0x444444};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","invite_close","objects[obj_name].x=206;objects[obj_name].y=23;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){cards_menu.hide_invite_dialog()};objects[obj_name].base_tint=objects[obj_name].tint;",""],["image","chk_round_1_tex",""],["image","chk_7_1_tex",""],["image","chk_7_2_tex",""],["image","chk_round_2_tex",""],["sprite","pref_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","pref_ok","objects[obj_name].x=130;objects[obj_name].y=195;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.pref_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",""],["cont","pref_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=50;","objects[obj_name].addChild(objects.pref_bcg);objects[obj_name].addChild(objects.pref_ok);objects[obj_name].addChild(objects.chk_quad_block);objects[obj_name].addChild(objects.chk_7_block);objects[obj_name].addChild(objects.chk_round_block);objects[obj_name].addChild(objects.chk_opt_frame);app.stage.addChild(objects[obj_name]);"],["block","chk_7_block","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=180;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(1)};","objects[obj_name].texture=game_res.resources.chk_7_1_tex.texture;"],["block","chk_round_block","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=280;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(2)};","objects[obj_name].texture=game_res.resources.chk_round_1_tex.texture;"],["block","chk_quad_block","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=80;objects[obj_name].sy=objects[obj_name].y=90;objects[obj_name].width=70;objects[obj_name].height=70;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){main_menu.chk_type_sel(0)};","objects[obj_name].texture=game_res.resources.chk_quad_1_tex.texture;"],["sprite","chk_opt_frame","objects[obj_name].x=60;objects[obj_name].y=70;",""],["image","lb_player_card_bcg",""],["block","lb_cards_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=0;","for (let i=0;i<7;i++)objects[obj_name].addChild(objects.lb_cards[i]);app.stage.addChild(objects[obj_name]);"],["array","lb_cards",7,"var num=n;objects[obj_name][num]=new lb_player_card_class(0,0,num+4);",""],["block","lb_back_button","objects[obj_name]=new PIXI.Sprite();objects[obj_name].x=700;objects[obj_name].y=320;objects[obj_name].visible=false;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].pointerdown=function(){lb.back_button_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};","objects[obj_name].texture=objects.back_button.texture;app.stage.addChild(objects[obj_name]);"],["block","sent_sticker_area","objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=345;objects[obj_name].sy=objects[obj_name].y=170;objects[obj_name].width=105;objects[obj_name].height=100;","app.stage.addChild(objects[obj_name]);"],["block","rec_sticker_area","objects[obj_name]=new PIXI.Sprite();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=260;objects[obj_name].width=140;objects[obj_name].height=140;","app.stage.addChild(objects[obj_name]);"],["block","lb_3_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=40;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=120;objects[obj_name].height=120;","objects[obj_name].mask=objects.lb_3_mask;"],["sprite","lb_3_mask","objects[obj_name].x=40;objects[obj_name].y=50;",""],["block","lb_3_name","objects[obj_name]=new PIXI.BitmapText('Загрузка...', {font: '26px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=130;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_3_rating","objects[obj_name]=new PIXI.BitmapText('...', {font: '28px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=100;objects[obj_name].y=156;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["cont","lb_3_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=-10;objects[obj_name].sy=objects[obj_name].y=1730-1510+40;","objects[obj_name].addChild(objects.lb_3_avatar);objects[obj_name].addChild(objects.lb_3_mask);objects[obj_name].addChild(objects.lb_3_frame);objects[obj_name].addChild(objects.lb_3_crown);objects[obj_name].addChild(objects.lb_3_name);objects[obj_name].addChild(objects.lb_3_rating);app.stage.addChild(objects[obj_name]);"],["sprite","lb_3_frame","objects[obj_name].x=40;objects[obj_name].y=50;",""],["sprite","lb_3_crown","objects[obj_name].x=11;objects[obj_name].y=22;",""],["block","lb_1_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=170;objects[obj_name].height=170;","objects[obj_name].mask=objects.lb_1_mask;"],["sprite","lb_1_mask","objects[obj_name].x=10;objects[obj_name].y=50;",""],["cont","lb_1_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=10;objects[obj_name].sy=objects[obj_name].y=1480-1510+40;","objects[obj_name].addChild(objects.lb_1_mask);objects[obj_name].addChild(objects.lb_1_avatar);objects[obj_name].addChild(objects.lb_1_frame);objects[obj_name].addChild(objects.lb_1_crown);objects[obj_name].addChild(objects.lb_1_name);objects[obj_name].addChild(objects.lb_1_rating);app.stage.addChild(objects[obj_name]);"],["block","lb_1_name","objects[obj_name]=new PIXI.BitmapText('Загрузка...', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_1_rating","objects[obj_name]=new PIXI.BitmapText('...', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=95;objects[obj_name].y=190;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["sprite","lb_1_frame","objects[obj_name].x=10;objects[obj_name].y=50;",""],["sprite","lb_1_crown","objects[obj_name].x=98;objects[obj_name].y=24;",""],["block","lb_2_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=20;objects[obj_name].sy=objects[obj_name].y=50;objects[obj_name].width=130;objects[obj_name].height=130;","objects[obj_name].mask=objects.lb_2_mask;"],["sprite","lb_2_mask","objects[obj_name].x=10;objects[obj_name].y=40;",""],["block","lb_2_name","objects[obj_name]=new PIXI.BitmapText('Загрузка...', {font: '28px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=85;objects[obj_name].y=140;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","lb_2_rating","objects[obj_name]=new PIXI.BitmapText('...', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=88;objects[obj_name].y=166;objects[obj_name].base_tint=objects[obj_name].tint=0XBDD7EE;",""],["cont","lb_2_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=130;objects[obj_name].sy=objects[obj_name].y=1635-1510+40;","objects[obj_name].addChild(objects.lb_2_avatar);objects[obj_name].addChild(objects.lb_2_mask);objects[obj_name].addChild(objects.lb_2_frame);objects[obj_name].addChild(objects.lb_2_crown);objects[obj_name].addChild(objects.lb_2_name);objects[obj_name].addChild(objects.lb_2_rating);app.stage.addChild(objects[obj_name]);"],["sprite","lb_2_frame","objects[obj_name].x=10;objects[obj_name].y=40;",""],["sprite","lb_2_crown","objects[obj_name].x=87;objects[obj_name].y=17;",""],["sprite","req_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","req_name","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=251;objects[obj_name].y=73;objects[obj_name].base_tint=objects[obj_name].tint=0X2F5597;",""],["block","req_rating","objects[obj_name]=new PIXI.BitmapText('', {font: '30px Century Gothic',align: 'center'});objects[obj_name].anchor.set(0.5,0);objects[obj_name].x=251;objects[obj_name].y=117;objects[obj_name].base_tint=objects[obj_name].tint=0XFFFF00;",""],["block","req_avatar","objects[obj_name]=new PIXI.Sprite();objects[obj_name].sx=objects[obj_name].x=50;objects[obj_name].sy=objects[obj_name].y=70;objects[obj_name].width=90;objects[obj_name].height=80;",""],["sprite","req_ok","objects[obj_name].x=20;objects[obj_name].y=145;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.accept()};objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","req_deny","objects[obj_name].x=190;objects[obj_name].y=145;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].pointerdown=function(){req_dialog.reject()};objects[obj_name].base_tint=objects[obj_name].tint;",""],["cont","req_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=210;objects[obj_name].sy=objects[obj_name].y=-10;","objects[obj_name].addChild(objects.req_bcg);objects[obj_name].addChild(objects.req_avatar);objects[obj_name].addChild(objects.req_name);objects[obj_name].addChild(objects.req_rating);objects[obj_name].addChild(objects.req_ok);objects[obj_name].addChild(objects.req_deny);app.stage.addChild(objects[obj_name]);"],["image","wait_response",""],["sprite","big_message_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["block","big_message_text","objects[obj_name]=new PIXI.BitmapText('', {font: '25px Century Gothic', align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=160;objects[obj_name].y=30;objects[obj_name].base_tint=objects[obj_name].tint=0XF2F2F2;",""],["cont","big_message_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=240;objects[obj_name].sy=objects[obj_name].y=40;objects[obj_name].show=function(){this.children.forEach(c=>{c.alpha=1;c.tint=c.base_tint})};","objects[obj_name].addChild(objects.big_message_bcg);objects[obj_name].addChild(objects.big_message_text);objects[obj_name].addChild(objects.close_big_message);objects[obj_name].addChild(objects.big_message_text2);app.stage.addChild(objects[obj_name]);"],["sprite","close_big_message","objects[obj_name].buttonMode=true;objects[obj_name].interactive=true;objects[obj_name].x=99;objects[obj_name].y=147;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};objects[obj_name].pointerdown=function(){big_message.close()};    ",""],["block","big_message_text2","objects[obj_name]=new PIXI.BitmapText('------', {font: '28px Century Gothic', align: 'center'});objects[obj_name].anchor.set(0.5,0,5);objects[obj_name].maxWidth=270;objects[obj_name].x=159;objects[obj_name].y=123;objects[obj_name].base_tint=objects[obj_name].tint=0XFFC000;",""],["sprite","rules_bcg","objects[obj_name].x=10;objects[obj_name].y=10;objects[obj_name].base_tint=objects[obj_name].tint;",""],["sprite","rules_ok_button","objects[obj_name].x=290;objects[obj_name].y=352;objects[obj_name].interactive=true;objects[obj_name].buttonMode=true;objects[obj_name].base_tint=objects[obj_name].tint;objects[obj_name].pointerdown=function(){main_menu.rules_ok_down()};objects[obj_name].pointerover=function(){this.tint=0x55ffff};objects[obj_name].pointerout=function(){this.tint=this.base_tint};    ",""],["cont","rules_cont","objects[obj_name]=new PIXI.Container();objects[obj_name].visible=false;objects[obj_name].sx=objects[obj_name].x=30;objects[obj_name].sy=objects[obj_name].y=0;","objects[obj_name].addChild(objects.rules_bcg);objects[obj_name].addChild(objects.rules_ok_button);app.stage.addChild(objects[obj_name]);"]];
const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {
	
	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.update_level=0;
		this.sx=this.x=x;
		this.sy=this.y=y;
		this.full_name="";
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.show_invite_dialog(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=50;
		
		
		this.name=new PIXI.BitmapText('Загрузка...', {font: '25px Century Gothic'});
		this.name.tint=0xD1E5D1;
		this.name.x=80;
		this.name.y=20;
		this.rating=0;
		
		this.rating_text=new PIXI.BitmapText('...', {font: '28px Century Gothic'});
		this.rating_text.tint=0xffff00;
		this.rating_text.x=192;
		this.rating_text.y=52;		
		
		this.addChild(this.bcg, this.avatar, this.name, this.rating_text);		
	}
	
}

class lb_player_card_class extends PIXI.Container{
	
	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
				
		
		this.place=new PIXI.BitmapText("1", {font: '25px Century Gothic'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;
		
		
		this.name=new PIXI.BitmapText('Загрузка...', {font: '25px Century Gothic'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;
		
	
		this.rating=new PIXI.BitmapText('...', {font: '25px Century Gothic'});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;		
		
		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);		
	}
	
	
}

var anim={
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	
	anim_array: [null,null,null,null,null,null,null,null,null,null,null],	
	linear: function(x) {
		
		return x
	},
	linear_and_back: function(x) {
		
		return x < 0.2 ? x*5 : 1.25 - x * 1.25

	},
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	easeOutQuart: function(x) {
		return 1 - Math.pow(1 - x, 4);
	},
	easeOutQuint: function(x) {
		return 1 - Math.pow(1 - x, 5);
	},
	easeInCubic: function(x) {
		return x * x * x;
	},
	easeInQuint: function(x) {
		return x * x * x * x * x;
	},
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	add_pos: function(params){

		if (params.callback===undefined)
			params.callback=()=>{};
		
		
		//если уже идет анимация данного спрайта то отменяем ее
		for (var i=0;i<this.anim_array.length;i++)
			if (this.anim_array[i]!==null)
				if (this.anim_array[i].obj===params.obj)
					this.anim_array[i]=null;
		
		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{
			
			if (this.anim_array[i]===null)	{
			
				params.obj.visible=true;
				params.obj.alpha=1;
				params.obj.ready=false;				
				
				//если в параметрах обозначена строка  - предполагаем что это параметр объекта
				if (typeof(params.val[0])==='string') params.val[0]=params.obj[params.val[0]];
				if (typeof(params.val[1])==='string') params.val[1]=params.obj[params.val[1]];				
				
				params.obj[params.param]=params.val[0];
				var delta=params.val[1]-params.val[0];	
				this.anim_array[i]={
										obj:params.obj, 
										process_func: this.process_pos.bind(this), 
										param:params.param, 
										vis_on_end:params.vis_on_end, 
										delta, 
										func:this[params.func].bind(anim), 
										start_val:params.val[0], 
										speed:params.speed ,
										progress:0, 
										callback:params.callback
									};	
				return;
			}
			
		}
		
		console.log("Нет свободных слотов для анимации");
		
	},
	add_scl: function(params){
	
		if (params.callback===undefined)
			params.callback=()=>{};
		
		//ищем свободный слот для анимации
		for (var i=0;i<this.anim_array.length;i++)	{
			
			if (this.anim_array[i]===null)	{
			
				params.obj.visible=true;
				params.obj.alpha=1;
				params.obj.ready=false;				
				
				var delta=params.val[1]-params.val[0];	
				this.anim_array[i]={
									obj:			params.obj, 
									process_func: 	this.process_scl.bind(this), 
									param:			params.param, 
									vis_on_end:		params.vis_on_end, 
									delta, 
									func:			this[params.func].bind(anim), 
									start_val:		params.val[0], 
									speed:			params.speed ,
									progress:		0, 
									callback		:params.callback
								};	
				return;
			}
			
		}
		
		console.log("Нет свободных слотов для анимации");
		
	},
	process: function()	{
		for (var i=0;i<this.anim_array.length;i++)
			if (this.anim_array[i]!==null)
				this.anim_array[i].process_func(i);
	},
	process_pos: function(i) {
		
		this.anim_array[i].obj[this.anim_array[i].param]=this.anim_array[i].start_val+this.anim_array[i].delta*this.anim_array[i].func(this.anim_array[i].progress);
						
		if (this.anim_array[i].progress>=1)	{
			this.anim_array[i].callback();
			this.anim_array[i].obj.visible=this.anim_array[i].vis_on_end;
			this.anim_array[i].obj.ready=true;
			this.anim_array[i]=null;	
			return;			
		}
		
		this.anim_array[i].progress+=this.anim_array[i].speed;
	},
	process_scl: function(i) {
		
		this.anim_array[i].obj.scale[this.anim_array[i].param]=this.anim_array[i].start_val+this.anim_array[i].delta*this.anim_array[i].func(this.anim_array[i].progress);
						
		if (this.anim_array[i].progress>=1)	{
			this.anim_array[i].callback();
			this.anim_array[i].obj.visible=this.anim_array[i].vis_on_end;
			this.anim_array[i].obj.ready=true;
			this.anim_array[i]=null;
			return;
		}
		
		this.anim_array[i].progress+=this.anim_array[i].speed;
	}
	
}

function add_message(text) {
	
	//воспроизводим звук
	game_res.resources.message.sound.play();

	objects.message_text.text=text;

	anim.add_pos({obj:objects.message_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-200, 	'sx'],	speed:0.02});
	
	if (objects.message_cont.timer_id!==undefined)	clearTimeout(objects.message_cont.timer_id);
		
	
	//убираем сообщение через определенное время
	objects.message_cont.timer_id=setTimeout(()=>{
		anim.add_pos({obj:objects.message_cont,param:'x',vis_on_end:false,func:'easeInBack',val:['sx', 	-200],	speed:0.02});
	}, 6000);		

}

var big_message={
	
	callback_func: function(){},
	
	show: function(text,text2,callback) {
		
		any_dialog_active=1;
		

		if (text2!==undefined || text2!=="")
			objects.big_message_text2.text=text2;
		else
			objects.big_message_text2.text='**********';
		
		if (callback===undefined)
			this.callback_func=()=>{};
		else
			this.callback_func=callback;

		objects.big_message_text.text=text;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-180, 	'sy'],	speed:0.02});
			
	},
	
	close : function() {
		
		any_dialog_active=1;
		
		//вызываем коллбэк
		
		this.callback_func();
		game_res.resources.close.sound.play();
		
		if (objects.big_message_cont.ready===false)
			return;
		
		any_dialog_active=0;
		anim.add_pos({obj:objects.big_message_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	450],	speed:0.05});
		
	}	
}

var board_func={
	
	checker_to_move: "",
	target_point: 0,
	tex_2:0,
	tex_1:0,
	moves: [],
	move_end_callback: function(){},
	
	update_board: function() {
		
		this.target_point=0;
		
		//сначала скрываем все шашки
		objects.checkers.forEach((c)=>{	c.visible=false});

		var ind=0;
		for (var x=0;x<8;x++) {
			for (var y=0;y<8;y++) {	

				if (g_board[y][x]!==0)
				{					
					if (g_board[y][x]===2)
						objects.checkers[ind].texture=this.tex_2;
				
					if (g_board[y][x]===1)
						objects.checkers[ind].texture=this.tex_1;
	
					objects.checkers[ind].x=x*50+objects.board.x+10;
					objects.checkers[ind].y=y*50+objects.board.y+10;
					
					objects.checkers[ind].ix=x;
					objects.checkers[ind].iy=y;
					objects.checkers[ind].m_id=g_board[y][x];
					objects.checkers[ind].alpha=1;
					
					//проверка что шашка под угрозой					
					if (x>3 && x<8 && y>4 && y<8 && move>24 && move<31 && objects.checkers[ind].m_id===1)
						objects.checkers[ind].danger=1;
					else
						objects.checkers[ind].danger=0;
					
					
					objects.checkers[ind].visible=true;
					ind++;	
				}
			}
		}	
		
	},
	
	get_checker_by_pos(x,y) {		

		for (let c of objects.checkers)
			if (c.ix===x && c.iy===y)	
				return c;
		return 0;
	},
	
	get_moves_path: function(move_data){
		
		var g_archive=[0,0,0,0,0,0,0,0,0,0,0];
		var move_archive=[[move_data.x1,move_data.y1]];
		
		
		function left(move_data,cur_board, m_archive) {
			
			var new_x=move_data.x1-1;
			var new_y=move_data.y1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;
			
			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;				
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];		
				}			
				return			
			}
			else
			{
				left_combo(move_data,cur_board,	m_archive);
			}		
		}
		
		function right(move_data,cur_board, m_archive) {
			var new_x=move_data.x1+1;
			var new_y=move_data.y1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;
			
			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;				
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];		
				}			
				return			
			}
			else
			{
				right_combo(move_data,cur_board, m_archive);
			}	
		}
		
		function up(move_data,cur_board, m_archive){
			var new_x=move_data.x1;
			var new_y=move_data.y1-1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;
			
			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;				
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];		
				}			
				return			
			}
			else
			{
				up_combo(move_data,cur_board, m_archive);
			}		
		}
		
		function down(move_data,cur_board, m_archive){
			var new_x=move_data.x1;
			var new_y=move_data.y1+1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0)
				return;
			
			if (cur_board[new_y][new_x]===0)
			{
				if (new_x===move_data.x2 && new_y===move_data.y2) {
					m_archive=null;				
					g_archive=[[move_data.x1,move_data.y1],[new_x,new_y]];		
				}			
				return			
			}
			else
			{
				down_combo(move_data,cur_board, m_archive);
			}	
		}
		
		function left_combo(move_data, cur_board, m_archive) {
			
			var new_x=move_data.x1-2;
			var new_y=move_data.y1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;			
			if (cur_board[move_data.y1][move_data.x1-1]===0) return;				
			if (cur_board[new_y][new_x]!==0) return;
			
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;	
			}							
			
			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			
			//продолжаем попытки комбо			
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));

		}
		
		function right_combo(move_data,cur_board, m_archive) {
			
			var new_x=move_data.x1+2;
			var new_y=move_data.y1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;			
			if (cur_board[move_data.y1][move_data.x1+1]===0) return;				
			if (cur_board[new_y][new_x]!==0) return;
			
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;	
			}							
			
			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
		
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			

		}
		
		function up_combo(move_data,cur_board, m_archive) {
			
			var new_x=move_data.x1;
			var new_y=move_data.y1-2;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;			
			if (cur_board[move_data.y1-1][move_data.x1]===0) return;				
			if (cur_board[new_y][new_x]!==0) return;
			
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;	
			}							
			
			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			up_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			
			
		}
		
		function down_combo(move_data,cur_board, m_archive) {
			
			var new_x=move_data.x1;
			var new_y=move_data.y1+2;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;			
			if (cur_board[move_data.y1+1][move_data.x1]===0) return;				
			if (cur_board[new_y][new_x]!==0) return;
			
			cur_board[new_y][new_x]=cur_board[move_data.y1][move_data.x1];
			
			m_archive.push([new_x,new_y]);		
			if (new_x===move_data.x2 && new_y===move_data.y2) {						
				//только если мы нашли более коротку последовательность
				if (m_archive.length<=g_archive.length)
					g_archive=m_archive;
				return;	
			}							
			
			//в первую часть хода записываем текущую позицию
			let m_data={x1:new_x,y1:new_y,x2:move_data.x2,y2:move_data.y2}
			
			right_combo(	m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			down_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));
			left_combo(		m_data, JSON.parse(JSON.stringify(cur_board)),	JSON.parse(JSON.stringify(m_archive)));			
			
		}
					
		left(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		right(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		up(		move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		down(	move_data,	JSON.parse(	JSON.stringify(g_board)),	JSON.parse(JSON.stringify(move_archive)));
		
		return g_archive;
	},
	
	start_gentle_move: function(move_data,moves,callback) {
	
		//подготавливаем данные для перестановки
		this.move_end_callback=callback;
		this.checker_to_move=this.get_checker_by_pos(move_data.x1,move_data.y1);		
		this.moves=moves;
		this.target_point=1;
		this.set_next_cell();
	
	},
	
	process_checker_move: function () {
		
		//двигаем шашки только если в игре
		if (state!=="playing" && state!=="bot")
			return;
		
		
		//двигаем шашку 
		if (this.target_point!==0) {
			
			this.checker_to_move.x+=this.checker_to_move.dx;
			this.checker_to_move.y+=this.checker_to_move.dy;
			
			var dx=this.checker_to_move.x-this.checker_to_move.tx;
			var dy=this.checker_to_move.y-this.checker_to_move.ty;	
			
			var d=Math.sqrt(dx*dx+dy*dy);			
			if (d<1) {
				
				//воспроизводим соответствующий звук
				game_res.resources.move.sound.play();

				this.set_next_cell();
			}
		}
		
	},
	
	set_next_cell() {
		
		//проверяем что движение завершилось
		if (this.target_point===this.moves.length) {
			
			this.target_point=0;
			
			var [sx,sy]=this.moves[0];			
			var [tx,ty]=this.moves[this.moves.length-1];	
			
			//меняем старую и новую позицию шашки
			[g_board[ty][tx],g_board[sy][sx]]=[g_board[sy][sx],g_board[ty][tx]];
			
			//обновляем доску
			board_func.update_board();
			
			//вызываем функцию которая обозначает завершение движения шашки
			this.move_end_callback();
			
			return;			
		}
		

		
		var [next_ix,next_iy]=this.moves[this.target_point];
		
		this.checker_to_move.tx=next_ix*50+objects.board.x+10;
		this.checker_to_move.ty=next_iy*50+objects.board.y+10;
		
		this.checker_to_move.dx=(this.checker_to_move.tx-this.checker_to_move.x)/10;
		this.checker_to_move.dy=(this.checker_to_move.ty-this.checker_to_move.y)/10;		
	
		this.target_point++;	
	},
		
	process_home_danger: function() {
		
		if (state==="bot")
			return;
		
		for (let c of objects.checkers) {			
			if (c.danger===1)
				c.alpha=Math.sin(game_tick*5)*0.5+0.5;
		}
		
	},
		
	count_finished1: function (boardv) {
		let cnt=0;
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]===1)
					cnt++;
		return cnt;
	},
	
	count_finished2: function (boardv) {
		let cnt=0;
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]===2)
					cnt++;
		return cnt;
	},
	
	finished1: function (boardv) {
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]!==1)
					return 0;
		return 1;
	},
	
	finished2: function (boardv) {
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]!==2)
					return 0;
		return 1;
	},

	any1home: function(boardv) {
		for (var y=5;y<8;y++)
			for (var x=4;x<8;x++)
				if (boardv[y][x]===1)
					return 1;
		return 0;	
	},

	any2home: function(boardv) {
		for (var y=0;y<3;y++)
			for (var x=0;x<4;x++)
				if (boardv[y][x]===2)
					return 1;
		return 0;	
	},
	
	get_board_state: function(board, cur_move) {	
		
		let w1=this.finished1(board);
		let w2=this.finished2(board);
		let any1home=this.any1home(board)*(cur_move>=30);
		let any2home=this.any2home(board)*(cur_move>=30);
		
		//это случай если игра дошла до 80 хода
		if (cur_move>=80) {
			
			let fin1=this.count_finished1(board);
			let fin2=this.count_finished2(board);
			
			if (fin1	>	fin2)	return 88;			
			if (fin1	<	fin2)	return 89;			
			if (fin1	===	fin2)	return 90;
		}

		//кодируем сосотяние игры в одно значение
		return w1*1+w2*2+any1home*4+any2home*5;
	}
}

var bot_game={
	
	start: function() {
		
		
		//устанавливаем локальный и удаленный статус
		state="bot";
		firebase.database().ref("states/"+my_data.uid).set(state);	
							
		objects.desktop.visible=false;				
		objects.main_buttons_cont.visible=false;
		objects.cards_cont.visible=false;
		
		objects.board.visible=true;
		
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		objects.timer_cont.visible=true;
		objects.stop_bot_button.visible=true;
		objects.cur_move_text.visible=true;
				
		//очереди
		who_play_next=1;		
	
		//включаем взаимодейтсвие с доской
		objects.board.interactive=true;
		objects.board.pointerdown=game.mouse_down_on_board;
		
		//инициируем доску в зависимости от рейтинга
		if (my_data.rating>=0 && my_data.rating<1500 )
			g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1500 && my_data.rating<1600 )
			g_board = [[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,0,2,0,0,0,0],[0,0,2,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1600 && my_data.rating<1700 )
			g_board = [[2,2,2,0,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,0,0,0,0,0],[0,2,0,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1700 && my_data.rating<1800 )
			g_board = [[0,0,2,2,0,0,0,0],[0,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		if (my_data.rating>=1800)
			g_board = [[0,0,2,2,0,0,0,0],[0,0,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		
		board_func.update_board();
		
		
	},
	
	stop : function() {
		

		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		game_res.resources.close.sound.play();		
		
		finish_game.bot(10);

		
	},
	
	make_move: function() {
		
		let m_data={};
		if (move<30)
			m_data=minimax_solver.minimax_3(g_board,move);
		else
			m_data=minimax_solver.minimax_4_single(g_board,move);
	
		//получаем последовательность ходов
		let moves=board_func.get_moves_path(m_data);
	
		board_func.start_gentle_move(m_data,moves,function(){
			
			//перемещаем табло времени
			objects.timer_cont.x=620-objects.timer_cont.x;
			
			who_play_next=1;			
			let board_state=board_func.get_board_state(g_board, move);
			//проверяем не закончена ли игра
			if (board_state===1 || board_state===2 || board_state===3 || board_state===4 || board_state===9)  {
				
				//допускаем что 2 не могут быть зажаты
				if (board_state===9)
					board_state=4;
				
				finish_game.bot(board_state);					
			} 

		});	
		
	
	}
}

var calc_my_new_rating=function(res)	{
	
	var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
	if (res===1) 
		return Math.round(my_data.rating + 16 * (1 - Ea));
	if (res===0) 
		return Math.round(my_data.rating + 16 * (0.5 - Ea));
	if (res===-1)
		return Math.round(my_data.rating + 16 * (0 - Ea));
};

var calc_oppnent_new_rating=function(res)	{
	
	var Ea = 1 / (1 + Math.pow(10, ((my_data.rating-opp_data.rating)/400)));
	if (res===1) 
		return Math.round(opp_data.rating + 16 * (1 - Ea));
	if (res===0) 
		return Math.round(opp_data.rating + 16 * (0.5 - Ea));
	if (res===-1) 
		return Math.round(opp_data.rating + 16 * (0 - Ea));
};

var cut_string = function(s,f_size, max_width) {
	
	let sum_v=0;
	for (let i=0;i<s.length;i++) {
		
		let code_id=s.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];			
			s = s.substring(0, i) + 'S' + s.substring(i + 1);
		}		

		sum_v+=char_obj.xAdvance*f_size/64;	
		if (sum_v>max_width)
			return s.substring(0,i-1)+"...";		
	}
	return s
	
}

var finish_game = {
		
	online: function(res) {
	
		if (!(state==='playing' || h_state==="playing"))	return;
		
		//удаляем счетчик оставшегося на ход времени
		clearTimeout(game.move_timer);
				
		var game_result=0;
		var game_result_text="";
		var game_result_text2="";
		
		switch (res) {
			
			case 1: // шашки 1 завршили игру
				if (my_role==="master") {
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;					
				} else {
					game_result_text="Вы проиграли\nсоперник перевел шашки в новый дом";	
					game_result=-1;		
				}
			break;
			
			case 2:	// шашки 2 завршили игру					
				if (my_role==="master") {
					game_result_text="Вы проиграли\nсоперник перевел шашки в новый дом";	
					game_result=-1;					
				} else {
					game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
					game_result=1;		
				}					
			break;
			
			case 3:	// оба завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;	
			break;
			
			case 4:	// шашки 1 не успели вывести из дома за 30 ходов				
				if (my_role==="master") {					
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;							
				} else {
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;	
				}				
			break;				
			
			case 5: // шашки 2 не успели вывести из дома за 30 ходов

				if (my_role==="master") {
					game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
					game_result=1;					
				} else {
					game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
					game_result=-1;		
				}		
			break;
						
			case 9:	// оба не успели вывести из дома за 30 ходов
				game_result_text="НИЧЬЯ!\nникто не успел вывести шашки из дома за 30 ходов";
				game_result=0;	
			break;
			
			case 10:	
				game_result_text="Победа!\nСоперник сдался!";
				game_result=1;	
			break;
			
			case 11:	
				game_result_text="Вы сдались!";
				game_result=-1;	
			break;
			
			case 12:	
		
			break;
			
			case 13:	
				if (me_conf_play===1) {
					game_result_text="Вы проиграли!\nзакончилось время на ход!";
					game_result=-1;	
				} else {
					game_result_text="Похоже Вы не смогли начать игру!";
					game_result=999;		
				}
			break;
			
			case 14:	
				if (opp_conf_play===1) {
					game_result_text="Победа!\nсоперник не сделал ход!"; //возможно пропала связь
					game_result=1;	
				} else {
					game_result_text="Похоже соперник не смог начать игру!";
					game_result=999;						
				}	
			break;
			
			case 15:	//я отказываюсь от игры
				game_result_text="Вы отказались от игры!"; 
				game_result=999;	
			break;
			
			case 16:	//получение отказа от игры
				game_result_text="Соперник отказался от игры!";
				game_result=999;	
			break;
			
			case 88: // шашки 1 больше завели в дом на 80 ход
				if (my_role==="master") {
					game_result_text="Вы выиграли\nперевели больше шашек в новый дом";	
					game_result=1;					
				} else {
					game_result_text="Вы проиграли\nсоперник перевел больше шашек в новый дом";	
					game_result=-1;		
				}
			break;
			
			case 89: // шашки 2 больше завели в дом на 80 ход
				if (my_role==="master") {
					game_result_text="Вы проиграли\nсоперник перевел больше шашек в новый дом";	
					game_result=-1;						
				} else {
					game_result_text="Вы выиграли\nперевели больше шашек в новый дом";	
					game_result=1;		
				}
			break;
			
			case 90: // одинаково шашек в новом дому
				game_result_text="НИЧЬЯ!";
				game_result=0;	
			break;
			
		}
		
	
		
		if (game_result!==999) {
			
			//обновляем мой рейтинг в базе и на карточке
			let old_rating=my_data.rating;				
			
			//считаем и записываем мой новый рейтинг
			my_data.rating=calc_my_new_rating(game_result);				
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
			game_result_text2="Рейтинг: "+old_rating+" > "+my_data.rating;
			objects.my_card_rating.text=my_data.rating;		
			console.log(old_rating,my_data.rating)
			
			//также устанавливаем новый рейтинг оппонента так как он мог выйти из игры
			let new_opponent_rating=calc_oppnent_new_rating(-1*game_result);
			firebase.database().ref("players/"+[opp_data.uid]+"/rating").set(new_opponent_rating);
			
			//записываем результат в базу данных
			firebase.database().ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':game_result, 'ts':firebase.database.ServerValue.TIMESTAMP});

			//воспроизводим звук
			if (game_result===-1)
				game_res.resources.lose.sound.play();
			else
				game_res.resources.win.sound.play();	
		}


		//показыаем сообщение с результатом игры
		big_message.show(game_result_text,game_result_text2, function(){finish_game.show_ad()});
		
		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeOutBack',val:['sy',-450],	speed:0.03});	

		objects.giveup_dialog.visible=false;
		objects.cur_move_text.visible=false;
		objects.timer_cont.visible=false;
		objects.board.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;		
		objects.game_buttons_cont.visible=false;
		objects.selected_frame.visible=false;
		objects.checkers.forEach((c)=>{	c.visible=false});
		move=0;
		
		//показыаем основное меню
		main_menu.activate();		
		

		opp_data.uid="";		
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		if (h_state==="") {
			state="online";	
			firebase.database().ref("states/"+my_data.uid).set(state);				
		}
		else
			h_state="online";

		
	},
	
	bot: function(res) {
		
		var game_result_text="";
		var game_result_text2="";
		var game_result=1;
		
		switch (res) {
			
			case 1: // шашки 1 завершили игру
				game_result_text="Вы выиграли\nбыстрее оппонента перевели шашки в новый дом";	
			break;
			
			case 2:	// шашки 2 завершили игру
				game_result_text="Вы проиграли!\nоппонент быстрее Вас перевел шашки в новый дом";	
				game_result=0;
			break;
			
			case 3:	// шашки 1 и 2 завершили игру
				game_result_text="НИЧЬЯ!";
				game_result=0;
			break;
			
			case 4:	// шашки 1 не успели вывести из дома за 30 ходов
				game_result_text="Вы проиграли!\nне успели вывести шашки из дома за 30 ходов";	
				game_result=0;
			break;			
			
			case 5: // шашки 2 не успели вывести из дома за 30 ходов
				game_result_text="Вы выиграли!\nоппонент не успел вывести шашки из дома за 30 ходов";	
			break;
			
			case 9:	// шашки 1 и 2 не успели вывести из дома за 30 ходов
				game_result_text="НИЧЬЯ!\nникто не успел вывести шашки из дома за 30 ходов";
				game_result=0;
			break;
			
			case 10:	// нажали кнопку завершить
				game_result_text="Игра завершена";
				game_result=0;
			break;
			
		}
		
		
		//воспроизводим звук
		if (game_result===1) {
			
			//если мы играем в рамках соц.сети то обновляем рейтинг и на карточке тоже
			my_data.rating++;
			game_result_text2="Рейтинг: +1";
			objects.my_card_rating.text=my_data.rating;		
			firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);

			
			game_res.resources.win.sound.play();			
		}
		else {
			
			game_res.resources.lose.sound.play();				
		}

		
		//показыаем сообщение с результатом игры
		big_message.show(game_result_text,game_result_text2, function(){finish_game.show_ad()});
		
		
		//если диалоги еще открыты
		objects.timer_cont.visible=false;
		objects.board.visible=false;
		objects.stickers_cont.visible=false;
		objects.cur_move_text.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.game_buttons_cont.visible=false;
		objects.selected_frame.visible=false;
		objects.checkers.forEach((c)=>{	c.visible=false});
		objects.stop_bot_button.visible=false;
		move=0;
		
		//показыаем основное меню
		main_menu.activate();			
		
		
		//устанавливаем статус в базе данных только если досупна онлайн игра
		state="online";	
		firebase.database().ref("states/"+my_data.uid).set(state);				
		
	},
	
	show_ad: function() {
			
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {}, 
				onError: function() {}
						}
			})
		}
		
		if (game_platform==="VK_WEB") {
					 
			admanInit(
			
				{
				  user_id: my_data.uid.substring(2),
				  app_id: 7885384,
				  type: 'preloader'   
				},
			
			
				function onAdsReady(adman) {
				  adman.onStarted(function () {});
				  adman.onCompleted(function() {});          
				  adman.onSkipped(function() {});          
				  adman.onClicked(function() {});
				  adman.start('preroll');
				},							
				
				function onNoAds() {}
			);		
		}		
				
		if (game_platform==="VK_MINIAPP") {
					 
			vkBridge.send("VKWebAppShowNativeAds", {ad_format:"preloader"})
			.then(data => console.log(data.result))
			.catch(error => console.log(error));
		}
	
	
	}
	
} 

var game={
	
	move_time_left: 30,
	move_timer:0,
	
	activate: function(role) {
		
		console.clear();
		console.log(role);
		my_role=role;
		if (my_role==="master") {
			objects.timer_cont.x=610;
			who_play_next=2;
		} else {
			
			objects.timer_cont.x=10;
			who_play_next=1;
		}
		
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
		
		//ни я ни оппонент пока не подтвердили игру
		me_conf_play=0;
		opp_conf_play=0;
		
		game_res.resources.note.sound.play();	
		
		//это если перешли из бот игры
		objects.stop_bot_button.visible=false;
		selected_checker=0;
		objects.selected_frame.visible=false;	
		
		
		objects.board.visible=true;
		
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
		objects.timer_cont.visible=true;
		objects.game_buttons_cont.visible=true;
		objects.cur_move_text.visible=true;
		
		//обозначаем какой сейчас ход
		move=0;
		objects.cur_move_text.text="Ход: "+move;
		
		//включаем взаимодейтсвие с доской
		objects.board.pointerdown=game.mouse_down_on_board;
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		if (h_state==="") {
			state="playing";	
			firebase.database().ref("states/"+my_data.uid).set(state);				
		}
		else
			h_state="playing";
		
		
		//счетчик времени
		this.move_time_left=35;
		this.move_timer=setTimeout(function(){game.timer_tick()}, 1000);	
		objects.timer_text.tint=0xffffff;	
		
		//сначала скрываем все шашки
		g_board =[[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[2,2,2,2,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1],[0,0,0,0,1,1,1,1]];
		board_func.update_board();
		
	},
	
	timer_tick: function() {
		
		this.move_time_left--;
		
		if (this.move_time_left<0 && who_play_next===my_checkers)	{			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:14}});
			finish_game.online(13);
			return;			
		}
				
		
		if (this.move_time_left<-5) {
			if (who_play_next===(3-my_checkers))	{			
				firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:13}});
				finish_game.online(14);
				return;
			}
		}
		
		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left===5) {
			objects.timer_text.tint=0xff0000;	
			game_res.resources.clock.sound.play();
		}
	
		
		objects.timer_text.text="0:"+this.move_time_left;
		this.move_timer=setTimeout(function(){game.timer_tick()}, 1000);	
		
	},
		
	mouse_down_on_board : function(e) {
			
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};


		//если происходит движение шашки то выходим
		if (board_func.target_point!==0)
			return;			

		//проверяем что моя очередь
		if (who_play_next!==my_checkers) {
			add_message("не твоя очередь");			
			return;			
		}
			
		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;
		
		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board.x-10)/400);
		var new_y=Math.floor(8*(my-objects.board.y-10)/400);
		
		//если выбрана новая шашка
		if (selected_checker===0)
		{		
			//находим шашку по координатам
			selected_checker=board_func.get_checker_by_pos(new_x,new_y);
						
			if (selected_checker.m_id===my_checkers)
			{
				objects.selected_frame.x=selected_checker.x;
				objects.selected_frame.y=selected_checker.y;
				objects.selected_frame.visible=true;
				
				//воспроизводим соответствующий звук
				game_res.resources.move.sound.play();
				
				return;
			}	
			else
			{
				add_message("Это не ваши шашки");	
				selected_checker=0;
				return;
			}
		}
				
		if (selected_checker!==0)
		{			
			
			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===selected_checker.ix && new_y===selected_checker.iy)
			{				
				game_res.resources.move.sound.play();
				selected_checker=0;
				objects.selected_frame.visible=false;				
				return;
			}
			
			
			
			//формируем объект содержащий информацию о ходе
			let m_data={x1:selected_checker.ix,y1:selected_checker.iy,x2:new_x, y2:new_y};		
			
			//пытыемся получить последовательность ходов
			let moves=board_func.get_moves_path(m_data);
			
		
			if (moves.length!==11)
			{				

				objects.selected_frame.visible=false;
				
				//отменяем выделение
				selected_checker=0;		
				
				//отправляем ход сопернику
				game.process_my_move(m_data,moves);				
			}
			else
			{
				add_message("сюда нельзя ходить");
			}		
		}

	},
		
	process_my_move : function (move_data, moves) {
				
		//обновляем счетчик хода
		move++;
		objects.cur_move_text.text="Ход: "+move;
			
		//предварительно создаем доску для проверки завершения
		let new_board = JSON.parse(JSON.stringify(g_board));
		let {x1,y1,x2,y2}=move_data;
		[new_board[y1][x1],new_board[y2][x2]]=[new_board[y2][x2],new_board[y1][x1]];
		var board_state=0;
		if (my_role==="master") // если я мастер 
			board_state=board_func.get_board_state(new_board, move);
				
		//начинаем процесс плавного перемещения шашки		
		if (state==="bot") {			
			//это игра с ботом
			board_func.start_gentle_move(move_data,moves,function() {setTimeout(function(){bot_game.make_move()},400)});
		}	
		else
		{		
			//начинаем плавное перемещение шашки
			board_func.start_gentle_move(move_data,moves,function(){});		
			
			//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2

			move_data.x1=7-move_data.x1;
			move_data.y1=7-move_data.y1;
			move_data.x2=7-move_data.x2;
			move_data.y2=7-move_data.y2;	
			
			//отправляем ход сопернику
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:{...move_data,board_state:board_state}});	
		}

		

		
		//проверяем не закончена ли игра
		if (board_state!==0) 
			finish_game.online(board_state);		
			
		
		//уведомление что нужно вывести шашки из дома
		if (move>24 && move<31 ) {
			if (board_func.any1home(new_board))
				add_message("После 30 ходов не должно остаться шашек в доме");
		}
		
		//уведомление что игра скоро закончиться
		if (move>75 && move<81 ) {
			add_message("После 80 хода выиграет тот кто перевел больше шашек в новый дом");
		}
		
			
		
		//перезапускаем таймер хода и кто ходит
		this.move_time_left=30;
		objects.timer_text.tint=0xffffff;	
		who_play_next=3-who_play_next;				
			
		//перемещаем табло времени
		objects.timer_cont.x=620-objects.timer_cont.x;
				
		//обозначаем что я сделал ход и следовательно подтвердил согласие на игру
		me_conf_play=1;
		
	}
	
}

var giveup_menu={
	
	show: function() {
		

		
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};			
		any_dialog_active=1;
		
		if (objects.giveup_dialog.ready===false)
			return;		
		game_res.resources.click.sound.play();
		
		//--------------------------
		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:true,func:'easeOutCubic',val:[450,'sy'],	speed:0.05});	

	},
	
	give_up: function() {
		
		if (objects.giveup_dialog.ready===false)
			return;		
		game_res.resources.click.sound.play();
		
		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:10}});
					
		this.hide();
		
		finish_game.online(11);		
		
	},
	
	hide : function() {
		
		if (objects.giveup_dialog.ready===false)
			return;		
		game_res.resources.close.sound.play();
		
		any_dialog_active=0;
		
		//--------------------------
		anim.add_pos({obj:objects.giveup_dialog,param:'y',vis_on_end:false,func:'easeInCubic',val:['sy',450],	speed:0.05});	
	}
}

var keep_alive= function() {
		
	
	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();				
	firebase.database().ref("states/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref("states/"+my_data.uid).set(state);	
}

var minimax_solver={
	
		
bad_1:[[1,1,3,5,7,9,11,13],[2.41421356237309,2.41421356237309,3.65028153987288,5.39834563766817,7.28538328578604,9.22212513921044,11.181782043891,13.1538303421637],[4.23606797749979,4.23606797749979,5.06449510224598,6.43397840021018,8.07768723046357,9.85730076213408,11.7097201274713,13.6046652096173],[6.16227766016838,6.16227766016838,6.76782893563237,7.84819196258327,9.24264068711928,10.8309518948453,12.5391558273447,14.3239770383633],[8.12310562561766,8.12310562561766,8.59524158061724,9.47213595499958,10.6568542494924,12.0599784869252,13.6142267883608,15.2733602992265],[10.0990195135928,10.0990195135928,10.4841843207273,11.2161167019798,12.2340761322781,13.4741920492983,14.8813174877721,16.4125749429493],[12.0827625302982,12.0827625302982,12.407317850635,13.0327592528361,13.9193064834273,15.0213522268346,16.2955310501452,17.7048258315315],[14.0710678118655,14.0710678118655,14.351177701146,14.8958829951444,15.6780308541625,16.6645830153412,17.8218697243355,19.1190393939046]],

patterns:[[[0,1,1],[0,2,1],[1,0,1],[2,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[0,3,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,2],[3,0,1]],[[0,1,1],[0,2,2],[1,0,2],[1,2,1],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,1]],[[0,1,2],[0,2,2],[1,0,2],[1,1,1],[1,2,1],[2,0,1]],[[0,1,2],[0,2,1],[1,0,2],[1,1,1],[2,0,2],[2,1,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,2],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[1,0,1],[1,1,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,2],[1,1,1],[2,0,1]],[[0,1,1],[0,2,2],[1,0,1],[1,2,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[2,1,1]],[[0,1,1],[0,2,2],[0,3,1],[1,0,1],[2,0,1]],[[0,1,1],[0,2,1],[1,0,1],[2,0,2],[3,0,1]],[[0,1,2],[0,2,1],[1,0,2],[1,1,1],[2,0,1],[3,0,1]],[[0,1,2],[0,2,1],[0,3,1],[1,0,2],[1,1,1],[2,0,1]]],


	clone_board : function (board) {
		
		r_board=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
		for (let y=0;y<8;y++)
			for (let x=0;x<8;x++)
				r_board[y][x]=board[y][x];
		return r_board;
	},
		
	get_childs: function(board_data, checkers, forward){
				
		function check_in_hist(x,y, hist) {		
			for (let i=0;i<hist.length;i++)
				if (x===hist[i][0] && y===hist[i][1])
					return true;
			return false;
		}
		
		function left(ix,iy,cur_board,moves_hist,boards_array) {
			
			var new_x=ix-1;
			var new_y=iy;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			
			if (cur_board[new_y][new_x]===0) {						
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;						
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return;
			}
			else {
				left_combo(ix,iy,cur_board,moves_hist,boards_array);
			}		
		}
		
		function right(ix,iy,cur_board,moves_hist,boards_array) {
			var new_x=ix+1;
			var new_y=iy;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			
			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;						
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return			
			} else {
				right_combo(ix,iy,cur_board,moves_hist,boards_array);
			}	
		}
		
		function up(ix,iy,cur_board,moves_hist,boards_array){
			var new_x=ix;
			var new_y=iy-1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			
			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;						
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return			
			} else {
				up_combo(ix,iy,cur_board,moves_hist,boards_array);
			}		
		}
		
		function down(ix,iy,cur_board,moves_hist,boards_array){
			var new_x=ix;
			var new_y=iy+1;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			
			if (cur_board[new_y][new_x]===0) {
				cur_board[iy][ix]=0;
				cur_board[new_y][new_x]=checkers;						
				boards_array.push([cur_board,ix,iy,new_x,new_y]);
				return			
			} else {
				down_combo(ix,iy,cur_board,moves_hist,boards_array);
			}	
		}
		
		function left_combo(ix,iy,cur_board,moves_hist,boards_array) {
			
			var new_x=ix-2;
			var new_y=iy;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			if (cur_board[iy][ix-1]===0) return;						
					
			if (cur_board[new_y][new_x]===0)
			{
				
				if (check_in_hist(new_x,new_y,moves_hist)===true) return;
				
				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;
					
				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;
				
				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
				
				//продолжаем попытки комбо
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
			}
		}
		
		function right_combo(ix,iy,cur_board,moves_hist,boards_array) {
			
			var new_x=ix+2;
			var new_y=iy;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			if (cur_board[iy][ix+1]===0) return;		
					
			if (cur_board[new_y][new_x]===0)
			{
				
				if (check_in_hist(new_x,new_y,moves_hist)===true) return;
				
				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;
				
				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;
				
				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
				
				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);			
			}
		}
		
		function up_combo(ix,iy,cur_board,moves_hist,boards_array) {
			
			var new_x=ix;
			var new_y=iy-2;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			if (cur_board[iy-1][ix]===0) return;		
			
			if (cur_board[new_y][new_x]===0)
			{
				
				if (check_in_hist(new_x,new_y,moves_hist)===true) return;
				
				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;
				
				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;
				
				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
				
				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				up_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);			
			}
		}
		
		function down_combo(ix,iy,cur_board,moves_hist,boards_array) {
			
			var new_x=ix;
			var new_y=iy+2;
			
			if (new_x>7 || new_x<0 || new_y>7 || new_y<0) return;		
			if (cur_board[iy+1][ix]===0) return;		
			
			if (cur_board[new_y][new_x]===0)
			{
				if (check_in_hist(new_x,new_y,moves_hist)===true) return;
				
				moves_hist.push([ix,iy]);
				cur_board[new_y][new_x]=cur_board[iy][ix];
				cur_board[iy][ix]=0;
				
				let d_move=(new_x-moves_hist[0][0])+(new_y-moves_hist[0][1]);
				if (cur_board[new_y][new_x]===1)
					d_move=-d_move;
				
				if (d_move>min_move_amount)
					boards_array.push([minimax_solver.clone_board(cur_board),moves_hist[0][0],moves_hist[0][1],new_x,new_y]);
				
				//продолжаем попытки комбо
				right_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				down_combo(new_x,new_y,cur_board,moves_hist,boards_array);
				left_combo(new_x,new_y,cur_board,moves_hist,boards_array);			
			}
		}
		
		var boards_array=[];
		
		
		if (forward===1) {			
			
			if (checkers===1) {
				
				for (let y=0;y<8;y++) {
					for (let x=0;x<8;x++) {			
						if (board_data[y][x]===checkers) {
							var moves_hist=[[x,y]];
							left	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							up		(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						}
					}
				}			
			}
			
			if (checkers===2) {
				
				for (let y=0;y<8;y++) {
					for (let x=0;x<8;x++) {			
						if (board_data[y][x]===checkers) {
							var moves_hist=[[x,y]];
							right	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							down	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);					
						}
					}
				}			
			}	
		} else {
			
				for (let y=0;y<8;y++) {
					for (let x=0;x<8;x++) {			
						if (board_data[y][x]===checkers) {
							var moves_hist=[[x,y]];
							right	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							down	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);		
							left	(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
							up		(		x,y,	minimax_solver.clone_board(board_data),	moves_hist, boards_array);
						}
					}
				}
			
		}

		
						
		return boards_array;

	},

	update_weights_board: function(move) {
		
		let p=move/60+0.5;
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {					
				this.bad_1[y][x]=Math.pow(x*x+y*y,p)+Math.pow((1-x)*(1-x)+y*y,p);	
			}
		}

	},
	
	board_val: function(board, move) {

		var val_1=0;
		var val_2=0;

						
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {			
			
				if (board[y][x]===1)
					val_1-=this.bad_1[y][x];				
			
				if (board[y][x]===2)
					val_2-=this.bad_1[7-y][7-x];	
			}
		}				

		//вычисляем блокированных 2 и добавляем как бонус к 1 dxdy положительный
		for (let y=0;y<3;y++) {
			for (let x=0;x<4;x++) {
				if (board[y][x]===2) {
					for (let p=0;p<this.patterns.length;p++) {
						
						let pattern_ok=1;
						for (let r=0;r<this.patterns[p].length;r++) {
							let dy=this.patterns[p][r][0];
							let dx=this.patterns[p][r][1];
							let ch=this.patterns[p][r][2];
							
							if (board[y+dy][x+dx]!==ch) {
								pattern_ok=0;
								break;								
							}

						}						
						val_1+=pattern_ok*1000;	
					}
				}						
			}			
		}
		
		//вычисляем блокированных 1 и добавляем как бонус к 2 dxdy отрицательный
		for (let y=5;y<8;y++) {
			for (let x=4;x<8;x++) {
				if (board[y][x]===1) {
					for (let p=0;p<this.patterns.length;p++) {
						
						let pattern_ok=1;
						for (let r=0;r<this.patterns[p].length;r++) {
							let dy=-this.patterns[p][r][0];
							let dx=-this.patterns[p][r][1];
							let ch=3-this.patterns[p][r][2];
							
							if (board[y+dy][x+dx]!==ch) {
								pattern_ok=0;
								break;								
							}

						}						
						val_2+=pattern_ok*1000;	
					}
				}						
			}			
		}
		

	
		//проверяем не закончилась ли игра
		if (move>=30) {
			
			if (board_func.any1home(board)===1)
				val_2+=99999;	
			
			if (board_func.any2home(board)===1)
				val_1+=99999;		
		}

				
				
		return val_1-val_2;
	},
		
	invert_board: function(board) {
		
		inv_brd=minimax_solver.clone_board(board);
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				inv_brd[y][x] = board[7-y][7-x];
				if (inv_brd[y][x] !== 0)
					inv_brd[y][x] = 3 - inv_brd[y][x];
			}
		}

		return inv_brd;
		
	},
		
	how_bad_board_2: function(board) {

		var bad_val_1=0;
						
		for (let y=0;y<8;y++) {
			for (let x=0;x<8;x++) {				
				if (board[y][x]===2)
					bad_val_1+=this.bad_1[7-y][7-x];	
			}
		}	

		if (board_func.finished2(board))
			bad_val_1=-99999;
		
				
		return bad_val_1;
	},
		
	minimax_3: function(board,move) {
						
		this.update_weights_board(move);
		let inv_brd=this.invert_board(board);
		
		var m_data={};
		
		var max_0=-9999999;	
		var childs0=this.get_childs(inv_brd,1,1);		
		for (let c0=0;c0<childs0.length;c0++) {

				
			var min_1=9999999;
			var childs1=this.get_childs(childs0[c0][0],2,1);
			for (let c1=0;c1<childs1.length;c1++) {

				
				var max_2=-9999999;
				var childs2=this.get_childs(childs1[c1][0],1,1);
				for (let c2=0;c2<childs2.length;c2++) {
					
					
				max_2=Math.max(this.board_val(childs2[c2][0],move+3),max_2);
				if (max_2>min_1)
					break;
				}
				
			min_1=Math.min(min_1,max_2);
			if (min_1<max_0)
				break;
			}
			
		
		if (max_0<min_1) {
			max_0=min_1;
			m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
		}		
		}
		
		//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2
		m_data.x1=7-m_data.x1;
		m_data.y1=7-m_data.y1;
		m_data.x2=7-m_data.x2;
		m_data.y2=7-m_data.y2;
		return m_data;

	},
	
	minimax_4_single: function(board) {
				
		this.update_weights_board(15);
		min_move_amount=-3;
		
		//this.update_weights_board();
		var m_data={};
		var min_bad=99999;
		var min_depth=999;
		
		var childs0=this.get_childs(board,2,0);		
		for (let c0=0;c0<childs0.length;c0++) {
			let val=this.how_bad_board_2(childs0[c0][0]);
			if (val===min_bad && min_depth>1) {
				min_depth=1;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}		
			if (val<min_bad) {
				min_bad=val;
				m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
			}

			

			var childs1=this.get_childs(childs0[c0][0],2,0);
			for (let c1=0;c1<childs1.length;c1++) {
				let val=this.how_bad_board_2(childs1[c1][0]);				
				if (val===min_bad && min_depth>2) {
					min_depth=2;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}				
				if (val<min_bad) {
					min_bad=val;
					m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
				}

				
				var childs2=this.get_childs(childs1[c1][0],2,0);
				for (let c2=0;c2<childs2.length;c2++) {
					let val=this.how_bad_board_2(childs2[c2][0]);
					if (val<min_bad) {
						min_bad=val;
						min_depth=3;
						m_data={x1:childs0[c0][1],y1:childs0[c0][2],x2:childs0[c0][3], y2:childs0[c0][4]};
					}

				}

			}

		}
		

		return m_data;

	}
	
}

var process_new_message=function(msg) {
	
	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;
			
	//получение положительного ответа от игрока которому мы отправляли запрос и который уже создал игру
	if (state==="wait_response" || h_state==="wait_response") {
		
		//принимаем только положительный ответ от соответствующего соперника и начинаем игру
		if (msg.message==="ACCEPT"  && pending_player===msg.sender) {
			//в данном случае я мастер и хожу вторым
			opp_data.uid=msg.sender;		
			game_id=msg.game_id;		
			cards_menu.accepted_invite();		
		}
	
		//принимаем также отрицательный ответ от соответствующего соперника
		if (msg.message==="REJECT"  && pending_player===msg.sender) {
			cards_menu.rejected_invite();
		}
	
	}		
	
	//получение сообщение в состояни игры
	if (state==="playing" || h_state==="playing") {
		
		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {
			
			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);
			
			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);
			
			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);
			
			//получение сообщение с сдаче
			if (msg.message==="END" )
				finish_game.online(msg.data.board_state);	
			
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				receive_move(msg.data);
		}
	}
		
	//приглашение поиграть
	if(state==="online" || state==="bot" || h_state==="online" || h_state==="bot") {
		if (msg.message==="INV") {			
			req_dialog.show(msg.sender);			
		}
		if (msg.message==="INV_REM") {	
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender===opp_data.uid)
				req_dialog.hide(msg.sender);			
		}
	}
}

var receive_move = function(move_data) {
	
	//воспроизводим уведомление о том что соперник произвел ход
	game_res.resources.receive_move.sound.play();
	
	//считаем последовательность ходов
	let moves=board_func.get_moves_path(move_data);

	
	//плавно перемещаем шашку
	board_func.start_gentle_move(move_data,moves,function(){});
	
	//если игра завершена то переходим
	if (move_data.board_state!==0)	{
		finish_game.online(move_data.board_state);			
		return;			
	}
	
	//перезапускаем таймер хода
	game.move_time_left=30;
	objects.timer_text.tint=0xffffff;		
	
	//обозначаем кто ходит
	who_play_next=3-who_play_next;		
	
	//обозначаем что соперник сделал ход и следовательно подтвердил согласие на игру
	opp_conf_play=1;
	
	//перемещаем табло времени
	objects.timer_cont.x=620-objects.timer_cont.x;

}

var req_dialog={
	
	
	show(uid) {
	
		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {
			
			player_data=snapshot.val();
						
			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				console.log("Не получилось загрузить данные о сопернике");
			}	else	{

				//так как успешно получили данные о сопернике то показываем окно
				any_dialog_active=1;
				game_res.resources.receive_sticker.sound.play();	
				anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:true,func:'easeOutElastic',val:[-260, 	'sy'],	speed:0.02});

				//Отображаем  имя и фамилию на табло
			
				let t=player_data.name;
				t=cut_string(t,objects.req_name.fontSize,200);
				
				
				objects.req_name.text=t;	
				objects.req_rating.text=player_data.rating;
				opp_data.rating=player_data.rating;
				
				//throw "cut_string erroor";
				opp_data.uid=uid;
								
				//загружаем фото
				this.load_photo(player_data.pic_url);

			}		  
		});	  
	},
	
	load_photo: function(pic_url) {
		
		//загружаем аватар соперника
		var loader = new PIXI.Loader();
		loader.add("inv_avatar", pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader.load((loader, resources) => {
			objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			
		});		
	},
	
	reject: function() {
		
		if (objects.req_cont.ready===false)
			return;
		
		any_dialog_active=0;
		
		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},
	
	accept: function() {
				
		if (objects.req_cont.ready===false)
			return;
		
		any_dialog_active=0;
		
		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});
		
		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*99999999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		
		//заполняем карточку оппонента
		let t=cut_string(objects.req_name.text,objects.req_name.fontSize,140);
		objects.opp_card_name.text=t;	
		
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_card_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave");
		
	},
	
	hide: function() {
		
		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.visible===false)
			return;

		any_dialog_active=0;
		anim.add_pos({obj:objects.req_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy', 	-260],	speed:0.05});
	}

	
}

var main_menu= {
		
	waiting_user_data: 1,
		
	activate: function() {
		
		//просто добавляем контейнер с кнопками
		objects.main_buttons_cont.visible=true;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.desktop.texture;

	},
	
	close : function() {
		
		objects.main_buttons_cont.visible=false;
		objects.desktop.visible=false;
		
	},
	
	play_button_down: function () {
		
		if (any_dialog_active===1 || this.waiting_user_data===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		game_res.resources.click.sound.play();
		
		this.close();
		cards_menu.activate();
		
	},

	lb_button_down: function () {
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		game_res.resources.click.sound.play();
		
		this.close();
		lb.show();
		
	},
	
	rules_button_down: function () {
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		any_dialog_active=1;
		
		game_res.resources.click.sound.play();
		
		anim.add_pos({obj:objects.rules_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-450,'sy'],	speed:0.04});
		
	},
	
	rules_ok_down: function () {
		any_dialog_active=0;
		anim.add_pos({obj:objects.rules_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',-450],	speed:0.04});
	},
	
	pref_button_down: function () {
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		any_dialog_active=1;
		
		game_res.resources.click.sound.play();
		
		anim.add_pos({obj:objects.pref_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-200,'sy'],	speed:0.04});
		
	},
	
	pref_ok_down: function() {		
		
		any_dialog_active=0;
		game_res.resources.close.sound.play();	
		anim.add_pos({obj:objects.pref_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',-200],	speed:0.04});
		
	},
	

	
	chk_type_sel: function (i) {
		
		if (i===0)
		{			
			objects.chk_opt_frame.x=60;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_quad_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_quad_2_tex.texture;
		}
		
		if (i===1)
		{			
			objects.chk_opt_frame.x=160;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_7_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_7_2_tex.texture;
		}
		
		if (i===2)
		{			
			objects.chk_opt_frame.x=260;
			objects.chk_opt_frame.y=70;
			board_func.tex_1=game_res.resources.chk_round_1_tex.texture;
			board_func.tex_2=game_res.resources.chk_round_2_tex.texture;
		}
	},
	
	unblock: function() {		
		this.waiting_user_data=0;
		objects.play_button.alpha=1;		
	}
	
}

var lb={
	
	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	
	show: function() {
		
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;
		
		
		anim.add_pos({obj:objects.lb_1_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.02});
		anim.add_pos({obj:objects.lb_2_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.025});
		anim.add_pos({obj:objects.lb_3_cont,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.03});
		anim.add_pos({obj:objects.lb_cards_cont,param:'x',vis_on_end:true,func:'easeOutCubic',val:[450,0],	speed:0.03});
		
		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;
		
		for (let i=0;i<7;i++) {			
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];	
			objects.lb_cards[i].place.text=(i+4)+".";
			
		}
		
		
		this.update();
		
	},
	
	close: function() {
		
		
		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;
		
	},
	
	back_button_down: function() {
		
		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		
		game_res.resources.click.sound.play();		
		this.close();
		main_menu.activate();
		
	},
	
	update: function () {
		
		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {
			
			if (snapshot.val()===null) {
			  console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {				
				
				var players_array = [];
				snapshot.forEach(players_data=> {			
					if (players_data.val().name!=="" && players_data.val().name!=='')
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);	
				});
				

				players_array.sort(function(a, b) {	return b[1] - a[1];});
				
				
				//загружаем аватар соперника
				var loaderOptions = {loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE};
				var loader = new PIXI.Loader();
								
				var len=Math.min(10,players_array.length);
				
				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					let fname=players_array[i][0]+" "+players_array[i][1];					
					fname = cut_string(fname,objects['lb_1_name'].fontSize,180);
					
					objects['lb_'+(i+1)+'_name'].text=fname;
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][2];					
					loader.add('leaders_avatar_'+i, players_array[i][3],loaderOptions);
				};
				
				//загружаем остальных
				for (let i=3;i<10;i++) {
					let fname=players_array[i][0]+" "+players_array[i][1];	
					objects.lb_cards[i-3].full_name=fname;
					
					fname = cut_string(fname,objects.lb_cards[i-3].name.fontSize,180);
					
					objects.lb_cards[i-3].name.text=fname;
					objects.lb_cards[i-3].rating.text=players_array[i][2];					
					loader.add('leaders_avatar_'+i, players_array[i][3],loaderOptions);
				};
				
				
				
				loader.load((loader, resources) => {
					for (let i=0;i<3;i++)						
						objects['lb_'+(i+1)+'_avatar'].texture=resources['leaders_avatar_'+i].texture;
					
					for (let i=3;i<10;i++)						
						objects.lb_cards[i-3].avatar.texture=resources['leaders_avatar_'+i].texture;

				});
			}

		});
		
	}
		
}

var cards_menu={
	
	card_i: 1,
	activation_update:0,
	cards_pos: [[20,60],[20,140],[20,220],[20,300],[270,60],[270,140],[270,220],[270,300],[520,60],[520,140],[520,220]],
	
	activate: function () {
		
		this.activation_update=1;
		objects.cards_cont.visible=true;
		objects.back_button.visible=true;
		
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.cards_bcg.texture;
		
		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<11;i++)
			objects.mini_cards[i].visible=false;
				
		//добавляем карточку ии
		this.add_cart_ai();

		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});
		
		
	},
	
	players_list_updated: function(players) {	


		//если мы в игре то не обновляем карточки
		if (state==="playing" || state==="bot" || state==="hidden")
			return;
		
		//убираем игроков с ненужными состояниями		
		for (let uid in players) 
			if (players[uid]==="hidden")
				delete players[uid];
				
		//если слишком много карточек то убираем играющих игроков
		let players_len=Object.keys(players).length;
		if (players_len>10) {
			let players_to_delete=players_len-10;
			let deleted_players=0;
			for (let uid in players) {				
				if (players[uid]==="playing" && deleted_players<players_to_delete) {
					delete players[uid];					
					deleted_players++;					
				}				
			}			
		}
				
				
		//перечень - индикаторов новых игроков и уже имеющихся
		new_players={};
		
		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<11;i++)
			objects.mini_cards[i].visible=false;

		//сначала ищем уже существующие карточки
		for (let uid in players) {
			new_players[uid]=1;
			for(let i=1;i<11;i++) {			
				
				//это если уже есть карточка с этими данными
				if (uid===objects.mini_cards[i].uid) {
						
					//проверяем изменилось ли состояние если да то нужно обновить состояние и рейтинг
					let update_level=this.activation_update;
					if (players[uid]!==objects.mini_cards[i].state)
						update_level=1;		

					//добавляем карточку
					this.place_next_cart({id:i, update_level:update_level, state:players[uid]});
					
					//отмечаем что это не новый игрок
					new_players[uid]=0;
					break;
				}				
			}	
		}
			
		//теперь добавляем карточки новых игроков
		for (let uid in new_players)
			if (new_players[uid]===1)
				this.place_new_cart({uid:uid, state:players[uid]});
	

		//теперь обновляем данные на карточках если это требуется
		for(let i=1;i<11;i++)			
			if (objects.mini_cards[i].visible===true)
				this.update_cart(i);  					
		
		
		//когда карточки запускаются то надо обновить все
		this.activation_update=0;
		
	},
	
	update_cart: function(id) {		
	
		//если необходимый уровень апдейта 0
		if (objects.mini_cards[id].update_level===0)
			return;
		
		//запрашиваем информацию для карточки игрока
		firebase.database().ref("players/"+objects.mini_cards[id].uid).once('value').then((snapshot) => {

			player_data=snapshot.val();
			if (player_data===null) {
				console.log("Не получилось загрузить данные о сопернике");
			}
			else {

				//Отображаем  имя и фамилию на карточке
				let fname=player_data.name;
								
				fname = cut_string(fname,objects.mini_cards[0].name.fontSize,160);
	
				
				objects.mini_cards[id].pic_url=player_data.pic_url;
				objects.mini_cards[id].name.text=fname;
				objects.mini_cards[id].rating_text.text=player_data.rating;
				objects.mini_cards[id].rating=player_data.rating;
				
				//загружаем фото если уровень апдейта установлен на 2
				if (objects.mini_cards[id].update_level===2)
					this.load_avatar(id);
			}					  
		});			
		
	},
	
	load_avatar: function(id) {
	

		var loader=new PIXI.Loader();
		loader.add("opponent_avatar_"+id, objects.mini_cards[id].pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader.id=id;
		loader.load((loader, resources) => {
			objects.mini_cards[loader.id].avatar.texture=loader.resources["opponent_avatar_"+loader.id].texture;			
		});	
		
	},
	
	get_state_tint: function(s) {
		
		switch(s) {
			
			case "online":
				return 0x559955;
			break;
				
			case "idle":
				return 0x00ff00;
			break;
			
			case "bot":
				return 0x376f37;
			break;
			
			case "playing":
				return 0x344472;
			break;	

			case "wait_response":
				return 0x990000;
			break;	
		}		
	},
	
	place_next_cart: function(params={id:0, update_level:0, state:"online"}) {
		
		//устанавливаем цвет карточки в зависимости от состояния
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		
		objects.mini_cards[params.id].state=params.state;
		objects.mini_cards[params.id].visible=true;
		objects.mini_cards[params.id].x=this.cards_pos[this.card_i][0];
		objects.mini_cards[params.id].y=this.cards_pos[this.card_i][1];		
		objects.mini_cards[params.id].update_level=params.update_level;
		this.card_i++;
	},
	
	place_new_cart: function(params={uid:0, state: "online"}) {
		
		for(let i=1;i<11;i++) {			
			
			//это если уже есть карточка с этими данными
			if (objects.mini_cards[i].visible===false) {
					
					
				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
									
					
				objects.mini_cards[i].state=params.state;
				objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].visible=true;
				objects.mini_cards[i].x=this.cards_pos[this.card_i][0];
				objects.mini_cards[i].y=this.cards_pos[this.card_i][1];
				
				//здесь нужно обновить все и рейтинг и имя и аватар
				objects.mini_cards[i].update_level=2;
				this.card_i++;
				break;
			}				
		}		
		
	},
	
	add_cart_ai: function() {
						
		objects.mini_cards[0].x=this.cards_pos[0][0];	
		objects.mini_cards[0].y=this.cards_pos[0][1];		
		objects.mini_cards[0].bcg.tint=0x777777;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name.text="Бот";
		objects.mini_cards[0].rating_text.text="1400";
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;			
	},
	
	show_invite_dialog: function(cart_id) {
		
		if (any_dialog_active>0) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		
		any_dialog_active=3;
		
		pending_player="";
		
		game_res.resources.click.sound.play();	
		
		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
		
		anim.add_pos({obj:objects.invite_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[-150,'sy'],	speed:0.04});
		
		
		opp_data.rating=objects.mini_cards[cart_id].rating;		
		opp_data.uid=objects.mini_cards[cart_id].uid;
		
		let invite_available = 	opp_data.uid!==my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="online" || objects.mini_cards[cart_id].state==="bot");
		invite_available=invite_available || opp_data.uid==="AI";
								
		
		if(invite_available===true)
			objects.invite_button.visible=true;	
		else
			objects.invite_button.visible=false;				
		
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		objects.invite_name.text=objects.mini_cards[cart_id].name.text;
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;
		
	},
	
	close: function() {
		
		objects.cards_cont.visible=false;		
		objects.back_button.visible=false;
		objects.desktop.visible=false;
		
		//убираем диалог приглашения если он виден
		if (objects.invite_cont.visible===true)
			this.hide_invite_dialog();

		//подписываемся на изменения состояний пользователей
		firebase.database().ref("states").off();
		
	},
	
	hide_invite_dialog: function() {
		
		any_dialog_active=0;
		
		game_res.resources.close.sound.play();	
		
		if (objects.invite_cont.visible===false)
			return;
		
		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="")	
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
		
		anim.add_pos({obj:objects.invite_cont,param:'y',vis_on_end:false,func:'easeInBack',val:['sy',400],	speed:0.04});
			
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		if (h_state==="") {
			state="online";	
			firebase.database().ref("states/"+my_data.uid).set(state);				
		}
		else
			h_state="online";

		
	},
	
	send_invite: function() {
		
		if (any_dialog_active===1 && any_dialog_active!==3) {
			game_res.resources.locked.sound.play();
			return
		};	
		
		if (opp_data.uid==="AI")
		{			
			this.close();
			bot_game.start();				
		}
		else
		{
			game_res.resources.click.sound.play();
			objects.invite_button.texture=game_res.resources.wait_response.texture;
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=opp_data.uid;
			any_dialog_active=1
			
			//устанавливаем локальный и удаленный статус
			state="wait_response";	
			firebase.database().ref("states/"+my_data.uid).set(state);	
			
		}

		
		
		//заполняем карточку оппонента		
		objects.opp_card_name.text=objects.invite_name.text;
		objects.opp_card_rating.text=objects.invite_rating.text;
		objects.opp_card_avatar.texture=objects.invite_avatar.texture;
		
	},
		
	rejected_invite: function() {
		
		pending_player="";
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((');		
		
	},
	
	accepted_invite: function() {		
		cards_menu.close();
		game.activate("master");		
	},
	
	back_button_down: function() {
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};
		
		game_res.resources.click.sound.play();	
		
		this.close();
		main_menu.activate();
		
	}
	
}

var stickers={
	
	show_panel: function() {
		
		
		if (any_dialog_active===1) {
			game_res.resources.locked.sound.play();
			return
		};	
		any_dialog_active=1;
		
		if (objects.stickers_cont.ready===false)
			return;	
		game_res.resources.click.sound.play();
		
		
		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="playing")
			return;
		
		//анимационное появление панели стикеров
		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:true,func:'easeOutBack',val:[450,'sy'],	speed:0.02});	
	},	
	
	hide_panel: function() {
		
		game_res.resources.close.sound.play();
		
		if (objects.stickers_cont.ready===false)
			return;	
		
		any_dialog_active=0;
		
		//анимационное появление панели стикеров
		anim.add_pos({obj:objects.stickers_cont,param:'y',vis_on_end:false,func:'easeOutBack',val:['sy',-450],	speed:0.02});	
	},	
	
	send : function(id) {
		
		if (objects.stickers_cont.ready===false)
			return;		

		this.hide_panel();			

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});			
		add_message("Стикер отправлен сопернику");
				
		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		anim.add_pos({obj:objects.sent_sticker_area,param:'alpha',vis_on_end:true,func:'linear',val:[0, 0.5],	speed:0.02});	
		//objects.sticker_area.visible=true;
		//убираем стикер через 5 секунд
		if (objects.sent_sticker_area.timer_id!==undefined)
			clearTimeout(objects.sent_sticker_area.timer_id);		
		
		objects.sent_sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.sent_sticker_area,param:'alpha',vis_on_end:false,func:'linear',val:[0.5,0],	speed:0.02});}, 3000);
		
	},
	
	receive: function(id) {
		
		//воспроизводим соответствующий звук
		game_res.resources.receive_sticker.sound.play();

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
			
		anim.add_pos({obj:objects.rec_sticker_area,param:'x',vis_on_end:true,func:'easeOutBack',val:[-150,'sx'],	speed:0.02});	
		
		//убираем стикер через 5 секунд
		if (objects.rec_sticker_area.timer_id!==undefined)
			clearTimeout(objects.rec_sticker_area.timer_id);		
		objects.rec_sticker_area.timer_id=setTimeout(()=>{anim.add_pos({obj:objects.rec_sticker_area,param:'x',vis_on_end:false,func:'easeInBack',val:['x',-150],	speed:0.02});}, 5000);

	}
	
	
}

var user_data={
		
	// эта функция вызывается один раз в начале игры
	req_result: "",
		
	loadScript : function(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	vkbridge_events: function(e) {

		if (e.detail.type === 'VKWebAppGetUserInfoResult') {
			
			my_data.name=e.detail.data.first_name + ' ' + e.detail.data.last_name;
			my_data.uid="vk"+e.detail.data.id;
			my_data.pic_url=e.detail.data.photo_100;
			user_data.req_result="ok";	
			user_data.process_results();			
		}	
	},
			
	load: function() {
		
		let s=window.location.href;

		if (s.includes("yandex")) {
						
			Promise.all([
				this.loadScript('https://yandex.ru/games/sdk/v2')
			]).then(function(){
				user_data.yandex();	
			});

			return;
		}
				
		if (s.includes("vk.com") && s.includes("platform=web")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js'),
				this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')	
				
			]).then(function(){
				user_data.vk_web()
			});

			return;
		}
		
		if (s.includes("vk.com") && s.includes("html5_mobile")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js'),
				this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')	
				
			]).then(function(){
				user_data.vk_web()
			});
					
			return;
		}
		
		if (s.includes("vk.com") && s.includes("html5_android")) {
			
			Promise.all([
				this.loadScript('https://vk.com/js/api/xd_connection.js?2'),
				this.loadScript('//ad.mail.ru/static/admanhtml/rbadman-html5.min.js'),
				this.loadScript('//vk.com/js/api/adman_init.js'),
				this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')		
			]).then(function(){
				user_data.vk_miniapp();	
			})	
			
			return;
		}

		if (s.includes("192.168")) {			
			this.local();	
			return;
		}
		
		this.unknown();
		
	},
	
	yandex: function() {
	
		game_platform="YANDEX";
		if(typeof(YaGames)==='undefined')
		{		
			user_data.req_result='yndx_sdk_error';
			user_data.process_results();	
		}
		else
		{
			//если sdk яндекса найден
			YaGames.init({}).then(ysdk => {
				
				//фиксируем SDK в глобальной переменной
				window.ysdk=ysdk;
				
				
				return ysdk.getPlayer();
			}).then((_player)=>{
				
				my_data.name 	=	_player.getName();
				my_data.uid			=	_player.getUniqueID().replace(/\//g, "Z");	
				my_data.pic_url		=	_player.getPhoto('medium');		
				
				console.log(my_data.uid);
				user_data.req_result='ok';
								
				if (my_data.name=="" || my_data.name=='')
					my_data.name=my_data.uid.substring(0,5);
				
			}).catch(err => {		
				console.log(err);
				user_data.req_result='yndx_init_error';			
			}).finally(()=>{			
				user_data.process_results();			
			})		
			
		}				

	},
			
	vk_web: function() {
		
		game_platform="VK_WEB";
		
		if(typeof(VK)==='undefined')
		{		
			user_data.req_result='vk_sdk_error';
			user_data.process_results();	
		}
		else
		{
			
			VK.init(
			
				//функция удачной инициализации вконтакте
				function()
				{

					VK.api(
						"users.get",
						{access_token: '2c2dcb592c2dcb592c2dcb59a62c55991122c2d2c2dcb594cfd0c5d42f4b700d3e509a5',fields: 'photo_100'},
						function (data) {
							if (data.error===undefined) {
								
								my_data.name=data.response[0].first_name+' '+data.response[0].last_name;
								my_data.uid="vk"+data.response[0].id;
								my_data.pic_url=data.response[0].photo_100;
								user_data.req_result="ok";	
								user_data.process_results();									
							}	
							else
							{
								user_data.req_result="vk_error";	
								user_data.process_results();	
							}
						}
					)
					
				},	
				
				//функция неудачной инициализации вконтакте
				function()
				{
					user_data.req_result='vk_init_error';
					user_data.process_results();				
				},

				//версия апи
				'5.130');		
			
		}

	},
	
	vk_miniapp: function() {
		
		game_platform="VK_MINIAPP";
		vkBridge.subscribe((e) => this.vkbridge_events(e)); 
		vkBridge.send('VKWebAppInit');	
		vkBridge.send('VKWebAppGetUserInfo');	
		
	},

	local: function() {	
	
		let uid = prompt('Локальная обстановка. Введите ID', 100);
		
		this.req_result='ok'		
		my_data.name="Local" + uid;
		my_data.uid="Local" + uid;
		my_data.pic_url="https://ibb.co/GCW6vg0";
		state="online";		
		this.process_results();

	},
	
	unknown: function () {
		
		//последний случай - запуск из неизвестного окружения
		user_data.req_result="not ok";
		this.process_results();
		
	},
	
	process_results: function() {
		
		console.log("Платформа: "+game_platform)
		
		//если не получилось авторизоваться в социальной сети то ищем куки
		if (user_data.req_result!=="ok") {		
		
			console.log('Ошибка авторизации в соц сети. Смотрим в локальном хранилище.');
		
			let c_player_uid=localStorage.getItem('uid');
			if (c_player_uid===undefined || c_player_uid===null) {
				
				let rnd_names=["Бегемот","Жираф","Зебра","Тигр","Ослик","Мамонт","Слон","Енот","Кролик","Бизон","Пантера"];
				let rnd_num=Math.floor(Math.random()*rnd_names.length)
				let rand_uid=Math.floor(Math.random() * 99999);
				my_data.name 	=	rnd_names[rnd_num]+rand_uid;
				my_data.rating=1400;
				my_data.skin_id=0;
				my_data.money=0;
				my_data.uid			=	"u"+rand_uid;	
				my_data.pic_url		=	"https://i.ibb.co/LN0NqZq/ava.jpg";	
				localStorage.setItem('uid',my_data.uid);		
				localStorage.setItem('name',my_data.name);	
				localStorage.setItem('money',my_data.money);	
				localStorage.setItem('pic_url',my_data.pic_url);	
				localStorage.setItem('skin_id',my_data.skin_id);	
			
			} else {				
				my_data.uid=localStorage.getItem('uid');
				my_data.name=localStorage.getItem('name');
				my_data.pic_url=localStorage.getItem('pic_url');
				my_data.money=localStorage.getItem('money');
				my_data.skin_id=localStorage.getItem('skin_id');
			}
		}		
				
		//если с аватаркой какие-то проблемы то ставим дефолтную
		if (my_data.pic_url===undefined || my_data.pic_url=="")
			my_data.pic_url	= "https://i.ibb.co/LN0NqZq/ava.jpg";
		
		//загружаем мою аватарку на табло хотя его пока не видно
		let loader2 = new PIXI.Loader();
		loader2.add('my_avatar', my_data.pic_url,{loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE});
		loader2.load((loader, resources) => {objects.player_avatar.texture = resources.my_avatar.texture;});				
					
					
		//показываем кнопки вконтакте если мы в этой соц. сети
		if (game_platform==='VK_WEB' || game_platform==='VK_MINIAPP') {
			objects.invite_friends_button.visible=true;
			objects.vk_post_button.visible=true;
		}
					
					
		//загружаем файербейс
		this.init_firebase();	
	
	},
	
	init_firebase: function() {
		
		
		//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
		firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
						
			var data=snapshot.val();
			if (data===null) {
				//если я первый раз в  игре
				my_data.rating=1400;	
				my_data.money=0;
				my_data.skin_id=0;
			}
			else {
				//если база данных вернула данные то все равно проверяем корректность ответа
				my_data.rating = data.rating || 1400;
				my_data.money=data.money || 0;
				my_data.skin_id=data.skin_id || 0;
			}			

		}).catch((error) => {	
			firebase.database().ref("errors/"+my_data.uid).set(error);
		}).finally(()=>{
			
			
			//сделаем сдесь защиту от неопределенности
			if (my_data.rating===undefined || my_data.name===undefined) {
				
				let keep_id=my_data.uid;
				if (my_data.rating===undefined)
					my_data.uid="re_"+keep_id;
				
				if (my_data.name===undefined)
					my_data.name="ne_"+keep_id;
				
				if (my_data.rating===undefined && my_data.first_name===undefined)
					my_data.uid="nre_"+keep_id;
				
				my_data.rating=1400;
				my_data.money=0;
				my_data.skin_id=0;
				my_data.name=my_data.name || "Игрок";
	
			}
			
			//присваиваем айди моего скина
			objects.player.skin_id=my_data.skin_id;

			//обновляем рейтинг и имя в моей карточке
			objects.player_rating_text.text=my_data.rating;	
			objects.player_name_text.text=cut_string(my_data.name,objects.player_name_text.fontSize,140);		
			
			//обновляем данные в перечне игроков
			firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
			
			//keep-alive сервис
			setInterval(function()	{keep_alive()}, 40000);

			//это событие когда меняется видимость приложения
			//document.addEventListener("visibilitychange", vis_change);
					
			//обновляем данные в файербейс
			firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, rating: my_data.rating,money: my_data.money, skin_id: my_data.skin_id, pic_url: my_data.pic_url, fp:0, tm:firebase.database.ServerValue.TIMESTAMP});
								
			//устанавливаем данные в попап
			objects.popup_avatar.texture=objects.player_avatar.texture
			objects.popup_rating_text.text=objects.player_rating_text.text;	
			objects.popup_name_text.text=objects.player_name_text.text;	
			
			//показываем попап с данными игрока
			anim.add_pos({obj: objects.popup_card_cont,	param: 'y',	vis_on_end: true,	func: 'easeOutCubic',	val: [-300, 'sy'],	speed: 0.05	});
			
			setTimeout(function(){anim.add_pos({obj: objects.popup_card_cont,	param: 'y',	vis_on_end: true,	func: 'easeInCubic',	val: ['sy', -300],	speed: 0.05	});},3000);
			
			//указываем что данные загружены
			search_opponent.user_date_complete=1;
			
		})	
	
	}	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height
    
    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }    
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function vis_change() {
	
	if (document.hidden===false) {
		if (h_state==="")
			return;		
		
		state=h_state;
		firebase.database().ref("states/"+my_data.uid).set(state);	
		
		h_state="";
	}
	
	if (document.hidden===true) {
		h_state=state;		
		state="hidden";
		firebase.database().ref("states/"+my_data.uid).set(state);	
	}	
}

function init_game_env() {
	

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyB4LIo94ev_emVqpImJEtrYKL9Y2N14Rl0",
			authDomain: "chess-52ff0.firebaseapp.com",
			projectId: "chess-52ff0",
			storageBucket: "chess-52ff0.appspot.com",
			messagingSenderId: "365064039990",
			appId: "1:365064039990:web:9aff017ef2aefe0a867297"
		});		
	}

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";		
	document.getElementById("m_progress").outerHTML = "";	
		
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x404040});
	document.body.appendChild(app.view);

	resize();
	window.addEventListener("resize", resize);	
		
	//создаем спрайты и массивы спрайтов и запускаем первую часть кода
	for (var i=0;i<load_list.length;i++) {			
		const obj_class=load_list[i][0];
		const obj_name=load_list[i][1];

		switch(obj_class)
		{			
			case "sprite":
				objects[obj_name]=new PIXI.Sprite(game_res.resources[obj_name].texture);
				eval(load_list[i][2]);
			break;
			
			case "block":
				eval(load_list[i][2]);						
			break;
			
			case "cont":
				eval(load_list[i][2]);						
			break;

			case "array":
				var a_size=load_list[i][2];
				objects[obj_name]=[];
				for (var n=0;n<a_size;n++)
					eval(load_list[i][3]);		
			break;
		}
	}
	
	//обрабатываем вторую часть кода в объектах
	for (var i=0;i<load_list.length;i++) {			
		const obj_class=load_list[i][0];
		const obj_name=load_list[i][1];

		switch(obj_class)
		{			
			case "sprite":
				eval(load_list[i][3]);
			break;
			
			case "block":
				eval(load_list[i][3]);						
			break;
			
			case "cont":
				eval(load_list[i][3]);						
			break;

			case "array":
				var a_size=load_list[i][2];
				for (var n=0;n<a_size;n++)
					eval(load_list[i][4]);		
			break;
		}
	}

	
	//загружаем информацию об игроке
	user_data.load();	
	
	//устанавливаем начальный вид шашек
	board_func.tex_1=game_res.resources.chk_quad_1_tex.texture;
	board_func.tex_2=game_res.resources.chk_quad_2_tex.texture;
	
	//показыаем основное меню	
	main_menu.activate();

	//запускаем главный цикл
	main_loop(); 

}

function load_resources() {
	
	let git_src="https://akukamil.github.io/corners/"
	//let git_src=""
	
	
	game_res=new PIXI.Loader();	
	game_res.add("m2_font", git_src+"m_font.fnt");
	
	game_res.add('receive_move',git_src+'receive_move.mp3');
	game_res.add('note',git_src+'note.mp3');
	game_res.add('receive_sticker',git_src+'receive_sticker.mp3');
	game_res.add('message',git_src+'message.mp3');
	game_res.add('lose',git_src+'lose.mp3');
	game_res.add('win',git_src+'win.mp3');
	game_res.add('click',git_src+'click.mp3');
	game_res.add('close',git_src+'close.mp3');
	game_res.add('move',git_src+'move.mp3');
	game_res.add('locked',git_src+'locked.mp3');
	game_res.add('clock',git_src+'clock.mp3');


	//добавляем из листа загрузки
	for (var i=0;i<load_list.length;i++)
		if (load_list[i][0]=="sprite" || load_list[i][0]=="image") 
			game_res.add(load_list[i][1], git_src+"res/"+load_list[i][1]+".png");
	
	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");
		
	game_res.load(init_game_env);		
	game_res.onProgress.add(progress);
	
	function progress(loader, resource) {
		
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
}

function main_loop() {
			
	//мигание кнопки пока не загрузились данные
	if (main_menu.waiting_user_data===1)		
		objects.play_button.alpha=Math.sin(game_tick*10)*0.25+0.75;

	//обработка передвижения шашек
	board_func.process_checker_move();
	
	game_tick+=0.016666666;
	anim.process();
    //app.render(app.stage);
	requestAnimationFrame(main_loop);
}

