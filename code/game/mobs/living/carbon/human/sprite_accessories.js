class SpriteAccessory {
	constructor(obj) {
		Object.assign(
			this,
			{
				icon: null,
				icon_state: null,
				base_icon: null,
				name: null,
				gender: null, // array of genders to accept, or null to accept all
				gender_specific: false, // //Something that can be worn by either gender, but looks different on each
			},
			obj
		);
	}
}

class HairAccessory extends SpriteAccessory {
	constructor(obj = {}) {
		obj.icon = obj.hasOwnProperty("icon")
			? obj.icon
			: "icons/mob/bald_s/bald_s-dir1.png";
		super(obj);
	}
}
module.exports.facial = {
	abe_s: new HairAccessory({
		name: 'abe',
		icon_state: 'facial_abe_s',
		icon: 'icons/mob/human_face/facial_abe_s/facial_abe_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_abe_s/'
	}),
	chaplin_s: new HairAccessory({
		name: 'chaplin',
		icon_state: 'facial_chaplin_s',
		icon: 'icons/mob/human_face/facial_chaplin_s/facial_chaplin_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_chaplin_s/'
	}),
	chin_s: new HairAccessory({
		name: 'chin',
		icon_state: 'facial_chin_s',
		icon: 'icons/mob/human_face/facial_chin_s/facial_chin_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_chin_s/'
	}),
	dwarf_s: new HairAccessory({
		name: 'dwarf',
		icon_state: 'facial_dwarf_s',
		icon: 'icons/mob/human_face/facial_dwarf_s/facial_dwarf_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_dwarf_s/'
	}),
	elvis_s: new HairAccessory({
		name: 'elvis',
		icon_state: 'facial_elvis_s',
		icon: 'icons/mob/human_face/facial_elvis_s/facial_elvis_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_elvis_s/'
	}),
	fullbeard_s: new HairAccessory({
		name: 'fullbeard',
		icon_state: 'facial_fullbeard_s',
		icon: 'icons/mob/human_face/facial_fullbeard_s/facial_fullbeard_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_fullbeard_s/'
	}),
	gt_s: new HairAccessory({
		name: 'gt',
		icon_state: 'facial_gt_s',
		icon: 'icons/mob/human_face/facial_gt_s/facial_gt_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_gt_s/'
	}),
	hip_s: new HairAccessory({
		name: 'hip',
		icon_state: 'facial_hip_s',
		icon: 'icons/mob/human_face/facial_hip_s/facial_hip_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_hip_s/'
	}),
	hogan_s: new HairAccessory({
		name: 'hogan',
		icon_state: 'facial_hogan_s',
		icon: 'icons/mob/human_face/facial_hogan_s/facial_hogan_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_hogan_s/'
	}),
	invertedhorns: new HairAccessory({
		name: 'invertedhorns',
		icon_state: 'facial_invertedhorns',
		icon: 'icons/mob/human_face/facial_invertedhorns/facial_invertedhorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_invertedhorns/'
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'facial_jensen_s',
		icon: 'icons/mob/human_face/facial_jensen_s/facial_jensen_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_jensen_s/'
	}),
	largehorns: new HairAccessory({
		name: 'largehorns',
		icon_state: 'facial_largehorns',
		icon: 'icons/mob/human_face/facial_largehorns/facial_largehorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_largehorns/'
	}),
	longbeard_s: new HairAccessory({
		name: 'longbeard',
		icon_state: 'facial_longbeard_s',
		icon: 'icons/mob/human_face/facial_longbeard_s/facial_longbeard_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_longbeard_s/'
	}),
	massivehorns: new HairAccessory({
		name: 'massivehorns',
		icon_state: 'facial_massivehorns',
		icon: 'icons/mob/human_face/facial_massivehorns/facial_massivehorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_massivehorns/'
	}),
	mediumhorns: new HairAccessory({
		name: 'mediumhorns',
		icon_state: 'facial_mediumhorns',
		icon: 'icons/mob/human_face/facial_mediumhorns/facial_mediumhorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_mediumhorns/'
	}),
	neckbeard_s: new HairAccessory({
		name: 'neckbeard',
		icon_state: 'facial_neckbeard_s',
		icon: 'icons/mob/human_face/facial_neckbeard_s/facial_neckbeard_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_neckbeard_s/'
	}),
	pointedhorns: new HairAccessory({
		name: 'pointedhorns',
		icon_state: 'facial_pointedhorns',
		icon: 'icons/mob/human_face/facial_pointedhorns/facial_pointedhorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_pointedhorns/'
	}),
	selleck_s: new HairAccessory({
		name: 'selleck',
		icon_state: 'facial_selleck_s',
		icon: 'icons/mob/human_face/facial_selleck_s/facial_selleck_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_selleck_s/'
	}),
	smallbeard_s: new HairAccessory({
		name: 'smallbeard',
		icon_state: 'facial_smallbeard_s',
		icon: 'icons/mob/human_face/facial_smallbeard_s/facial_smallbeard_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_smallbeard_s/'
	}),
	smallhorns: new HairAccessory({
		name: 'smallhorns',
		icon_state: 'facial_smallhorns',
		icon: 'icons/mob/human_face/facial_smallhorns/facial_smallhorns-dir1.png',
		base_icon: 'icons/mob/human_face/facial_smallhorns/'
	}),
	vandyke_s: new HairAccessory({
		name: 'vandyke',
		icon_state: 'facial_vandyke_s',
		icon: 'icons/mob/human_face/facial_vandyke_s/facial_vandyke_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_vandyke_s/'
	}),
	verywise_s: new HairAccessory({
		name: 'verywise',
		icon_state: 'facial_verywise_s',
		icon: 'icons/mob/human_face/facial_verywise_s/facial_verywise_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_verywise_s/'
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'facial_volaju_s',
		icon: 'icons/mob/human_face/facial_volaju_s/facial_volaju_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_volaju_s/'
	}),
	watson_s: new HairAccessory({
		name: 'watson',
		icon_state: 'facial_watson_s',
		icon: 'icons/mob/human_face/facial_watson_s/facial_watson_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_watson_s/'
	}),
	wise_s: new HairAccessory({
		name: 'wise',
		icon_state: 'facial_wise_s',
		icon: 'icons/mob/human_face/facial_wise_s/facial_wise_s-dir1.png',
		base_icon: 'icons/mob/human_face/facial_wise_s/'
	}),
}
module.exports.lips = {
	black: new HairAccessory({
		name: 'black',
		icon_state: 'lips_black',
		icon: 'icons/mob/human_face/lips_black/lips_black-dir1.png',
		base_icon: 'icons/mob/human_face/lips_black/'
	}),

	jade: new HairAccessory({
		name: 'jade',
		icon_state: 'lips_jade',
		icon: 'icons/mob/human_face/lips_jade/lips_jade-dir1.png',
		base_icon: 'icons/mob/human_face/lips_jade/'
	}),

	purple: new HairAccessory({
		name: 'purple',
		icon_state: 'lips_purple',
		icon: 'icons/mob/human_face/lips_purple/lips_purple-dir1.png',
		base_icon: 'icons/mob/human_face/lips_purple/'
	}),

	red: new HairAccessory({
		name: 'red',
		icon_state: 'lips_red',
		icon: 'icons/mob/human_face/lips_red/lips_red-dir1.png',
		base_icon: 'icons/mob/human_face/lips_red/'
	}),
}

module.exports.hair = {
	bald_s: new HairAccessory({
		name: 'bald',
		icon_state: 'bald_s',
		icon: 'icons/mob/human_face/bald_s/bald_s-dir1.png',
		base_icon: 'icons/mob/human_face/bald_s/'
	}),

	afro2_s: new HairAccessory({
		name: 'afro2',
		icon_state: 'hair_afro2_s',
		icon: 'icons/mob/human_face/hair_afro2_s/hair_afro2_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_afro2_s/'
	}),
	afro_s: new HairAccessory({
		name: 'afro',
		icon_state: 'hair_afro_s',
		icon: 'icons/mob/human_face/hair_afro_s/hair_afro_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_afro_s/'
	}),
	averagejoe_s: new HairAccessory({
		name: 'averagejoe',
		icon_state: 'hair_averagejoe_s',
		icon: 'icons/mob/human_face/hair_averagejoe_s/hair_averagejoe_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_averagejoe_s/'
	}),
	a_s: new HairAccessory({
		name: 'a',
		icon_state: 'hair_a_s',
		icon: 'icons/mob/human_face/hair_a_s/hair_a_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_a_s/'
	}),
	bedheadv2_s: new HairAccessory({
		name: 'bedheadv2',
		icon_state: 'hair_bedheadv2_s',
		icon: 'icons/mob/human_face/hair_bedheadv2_s/hair_bedheadv2_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bedheadv2_s/'
	}),
	bedheadv3_s: new HairAccessory({
		name: 'bedheadv3',
		icon_state: 'hair_bedheadv3_s',
		icon: 'icons/mob/human_face/hair_bedheadv3_s/hair_bedheadv3_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bedheadv3_s/'
	}),
	bedhead_s: new HairAccessory({
		name: 'bedhead',
		icon_state: 'hair_bedhead_s',
		icon: 'icons/mob/human_face/hair_bedhead_s/hair_bedhead_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bedhead_s/'
	}),
	beehive2_s: new HairAccessory({
		name: 'beehive2',
		icon_state: 'hair_beehive2_s',
		icon: 'icons/mob/human_face/hair_beehive2_s/hair_beehive2_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_beehive2_s/'
	}),
	beehive_s: new HairAccessory({
		name: 'beehive',
		icon_state: 'hair_beehive_s',
		icon: 'icons/mob/human_face/hair_beehive_s/hair_beehive_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_beehive_s/'
	}),
	bigafro_s: new HairAccessory({
		name: 'bigafro',
		icon_state: 'hair_bigafro_s',
		icon: 'icons/mob/human_face/hair_bigafro_s/hair_bigafro_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bigafro_s/'
	}),
	bobcurl_s: new HairAccessory({
		name: 'bobcurl',
		icon_state: 'hair_bobcurl_s',
		icon: 'icons/mob/human_face/hair_bobcurl_s/hair_bobcurl_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bobcurl_s/'
	}),
	bobcut_s: new HairAccessory({
		name: 'bobcut',
		icon_state: 'hair_bobcut_s',
		icon: 'icons/mob/human_face/hair_bobcut_s/hair_bobcut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bobcut_s/'
	}),
	bowlcut_s: new HairAccessory({
		name: 'bowlcut',
		icon_state: 'hair_bowlcut_s',
		icon: 'icons/mob/human_face/hair_bowlcut_s/hair_bowlcut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bowlcut_s/'
	}),
	bowl_s: new HairAccessory({
		name: 'bowl',
		icon_state: 'hair_bowl_s',
		icon: 'icons/mob/human_face/hair_bowl_s/hair_bowl_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bowl_s/'
	}),
	braid_s: new HairAccessory({
		name: 'braid',
		icon_state: 'hair_braid_s',
		icon: 'icons/mob/human_face/hair_braid_s/hair_braid_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_braid_s/'
	}),
	bun_s: new HairAccessory({
		name: 'bun',
		icon_state: 'hair_bun_s',
		icon: 'icons/mob/human_face/hair_bun_s/hair_bun_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_bun_s/'
	}),
	buzzcut_s: new HairAccessory({
		name: 'buzzcut',
		icon_state: 'hair_buzzcut_s',
		icon: 'icons/mob/human_face/hair_buzzcut_s/hair_buzzcut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_buzzcut_s/'
	}),
	b_s: new HairAccessory({
		name: 'b',
		icon_state: 'hair_b_s',
		icon: 'icons/mob/human_face/hair_b_s/hair_b_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_b_s/'
	}),
	chad_s: new HairAccessory({
		name: 'chad',
		icon_state: 'hair_chad_s',
		icon: 'icons/mob/human_face/hair_chad_s/hair_chad_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_chad_s/'
	}),
	cia_s: new HairAccessory({
		name: 'cia',
		icon_state: 'hair_cia_s',
		icon: 'icons/mob/human_face/hair_cia_s/hair_cia_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_cia_s/'
	}),
	combover_s: new HairAccessory({
		name: 'combover',
		icon_state: 'hair_combover_s',
		icon: 'icons/mob/human_face/hair_combover_s/hair_combover_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_combover_s/'
	}),
	crewcut_s: new HairAccessory({
		name: 'crewcut',
		icon_state: 'hair_crewcut_s',
		icon: 'icons/mob/human_face/hair_crewcut_s/hair_crewcut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_crewcut_s/'
	}),
	curls_s: new HairAccessory({
		name: 'curls',
		icon_state: 'hair_curls_s',
		icon: 'icons/mob/human_face/hair_curls_s/hair_curls_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_curls_s/'
	}),
	c_s: new HairAccessory({
		name: 'c',
		icon_state: 'hair_c_s',
		icon: 'icons/mob/human_face/hair_c_s/hair_c_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_c_s/'
	}),
	dandypompadour_s: new HairAccessory({
		name: 'dandypompadour',
		icon_state: 'hair_dandypompadour_s',
		icon: 'icons/mob/human_face/hair_dandypompadour_s/hair_dandypompadour_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_dandypompadour_s/'
	}),
	devilock_s: new HairAccessory({
		name: 'devilock',
		icon_state: 'hair_devilock_s',
		icon: 'icons/mob/human_face/hair_devilock_s/hair_devilock_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_devilock_s/'
	}),
	doublebun_s: new HairAccessory({
		name: 'doublebun',
		icon_state: 'hair_doublebun_s',
		icon: 'icons/mob/human_face/hair_doublebun_s/hair_doublebun_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_doublebun_s/'
	}),
	dreads_s: new HairAccessory({
		name: 'dreads',
		icon_state: 'hair_dreads_s',
		icon: 'icons/mob/human_face/hair_dreads_s/hair_dreads_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_dreads_s/'
	}),
	drillruru_s: new HairAccessory({
		name: 'drillruru',
		icon_state: 'hair_drillruru_s',
		icon: 'icons/mob/human_face/hair_drillruru_s/hair_drillruru_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_drillruru_s/'
	}),
	d_s: new HairAccessory({
		name: 'd',
		icon_state: 'hair_d_s',
		icon: 'icons/mob/human_face/hair_d_s/hair_d_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_d_s/'
	}),
	emolong_s: new HairAccessory({
		name: 'emolong',
		icon_state: 'hair_emolong_s',
		icon: 'icons/mob/human_face/hair_emolong_s/hair_emolong_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_emolong_s/'
	}),
	emoright_s: new HairAccessory({
		name: 'emoright',
		icon_state: 'hair_emoright_s',
		icon: 'icons/mob/human_face/hair_emoright_s/hair_emoright_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_emoright_s/'
	}),
	emo_s: new HairAccessory({
		name: 'emo',
		icon_state: 'hair_emo_s',
		icon: 'icons/mob/human_face/hair_emo_s/hair_emo_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_emo_s/'
	}),
	e_s: new HairAccessory({
		name: 'e',
		icon_state: 'hair_e_s',
		icon: 'icons/mob/human_face/hair_e_s/hair_e_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_e_s/'
	}),
	fade_s: new HairAccessory({
		name: 'fade',
		icon_state: 'hair_fade_s',
		icon: 'icons/mob/human_face/hair_fade_s/hair_fade_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_fade_s/'
	}),
	father_s: new HairAccessory({
		name: 'father',
		icon_state: 'hair_father_s',
		icon: 'icons/mob/human_face/hair_father_s/hair_father_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_father_s/'
	}),
	feather_s: new HairAccessory({
		name: 'feather',
		icon_state: 'hair_feather_s',
		icon: 'icons/mob/human_face/hair_feather_s/hair_feather_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_feather_s/'
	}),
	flair_s: new HairAccessory({
		name: 'flair',
		icon_state: 'hair_flair_s',
		icon: 'icons/mob/human_face/hair_flair_s/hair_flair_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_flair_s/'
	}),
	f_s: new HairAccessory({
		name: 'f',
		icon_state: 'hair_f_s',
		icon: 'icons/mob/human_face/hair_f_s/hair_f_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_f_s/'
	}),
	gelled_s: new HairAccessory({
		name: 'gelled',
		icon_state: 'hair_gelled_s',
		icon: 'icons/mob/human_face/hair_gelled_s/hair_gelled_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_gelled_s/'
	}),
	gentle_s: new HairAccessory({
		name: 'gentle',
		icon_state: 'hair_gentle_s',
		icon: 'icons/mob/human_face/hair_gentle_s/hair_gentle_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_gentle_s/'
	}),
	halfbang_alt_s: new HairAccessory({
		name: 'halfbang_alt',
		icon_state: 'hair_halfbang_alt_s',
		icon: 'icons/mob/human_face/hair_halfbang_alt_s/hair_halfbang_alt_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_halfbang_alt_s/'
	}),
	halfbang_s: new HairAccessory({
		name: 'halfbang',
		icon_state: 'hair_halfbang_s',
		icon: 'icons/mob/human_face/hair_halfbang_s/hair_halfbang_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_halfbang_s/'
	}),
	halfshaved_s: new HairAccessory({
		name: 'halfshaved',
		icon_state: 'hair_halfshaved_s',
		icon: 'icons/mob/human_face/hair_halfshaved_s/hair_halfshaved_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_halfshaved_s/'
	}),
	hbraid_s: new HairAccessory({
		name: 'hbraid',
		icon_state: 'hair_hbraid_s',
		icon: 'icons/mob/human_face/hair_hbraid_s/hair_hbraid_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_hbraid_s/'
	}),
	himecut_s: new HairAccessory({
		name: 'himecut',
		icon_state: 'hair_himecut_s',
		icon: 'icons/mob/human_face/hair_himecut_s/hair_himecut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_himecut_s/'
	}),
	hitop_s: new HairAccessory({
		name: 'hitop',
		icon_state: 'hair_hitop_s',
		icon: 'icons/mob/human_face/hair_hitop_s/hair_hitop_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_hitop_s/'
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'hair_jensen_s',
		icon: 'icons/mob/human_face/hair_jensen_s/hair_jensen_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_jensen_s/'
	}),
	jewlocks_s: new HairAccessory({
		name: 'jewlocks',
		icon_state: 'hair_jewlocks_s',
		icon: 'icons/mob/human_face/hair_jewlocks_s/hair_jewlocks_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_jewlocks_s/'
	}),
	joestar_s: new HairAccessory({
		name: 'joestar',
		icon_state: 'hair_joestar_s',
		icon: 'icons/mob/human_face/hair_joestar_s/hair_joestar_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_joestar_s/'
	}),
	kagami_s: new HairAccessory({
		name: 'kagami',
		icon_state: 'hair_kagami_s',
		icon: 'icons/mob/human_face/hair_kagami_s/hair_kagami_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_kagami_s/'
	}),
	kusanagi_s: new HairAccessory({
		name: 'kusanagi',
		icon_state: 'hair_kusanagi_s',
		icon: 'icons/mob/human_face/hair_kusanagi_s/hair_kusanagi_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_kusanagi_s/'
	}),
	longbraid_s: new HairAccessory({
		name: 'longbraid',
		icon_state: 'hair_longbraid_s',
		icon: 'icons/mob/human_face/hair_longbraid_s/hair_longbraid_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_longbraid_s/'
	}),
	longeralt2_s: new HairAccessory({
		name: 'longeralt2',
		icon_state: 'hair_longeralt2_s',
		icon: 'icons/mob/human_face/hair_longeralt2_s/hair_longeralt2_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_longeralt2_s/'
	}),
	longest_s: new HairAccessory({
		name: 'longest',
		icon_state: 'hair_longest_s',
		icon: 'icons/mob/human_face/hair_longest_s/hair_longest_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_longest_s/'
	}),
	longfringe_s: new HairAccessory({
		name: 'longfringe',
		icon_state: 'hair_longfringe_s',
		icon: 'icons/mob/human_face/hair_longfringe_s/hair_longfringe_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_longfringe_s/'
	}),
	longovereye_s: new HairAccessory({
		name: 'longovereye',
		icon_state: 'hair_longovereye_s',
		icon: 'icons/mob/human_face/hair_longovereye_s/hair_longovereye_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_longovereye_s/'
	}),
	mia_s: new HairAccessory({
		name: 'mia',
		icon_state: 'hair_mia_s',
		icon: 'icons/mob/human_face/hair_mia_s/hair_mia_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_mia_s/'
	}),
	mulder_s: new HairAccessory({
		name: 'mulder',
		icon_state: 'hair_mulder_s',
		icon: 'icons/mob/human_face/hair_mulder_s/hair_mulder_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_mulder_s/'
	}),
	nitori_s: new HairAccessory({
		name: 'nitori',
		icon_state: 'hair_nitori_s',
		icon: 'icons/mob/human_face/hair_nitori_s/hair_nitori_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_nitori_s/'
	}),
	odango_s: new HairAccessory({
		name: 'odango',
		icon_state: 'hair_odango_s',
		icon: 'icons/mob/human_face/hair_odango_s/hair_odango_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_odango_s/'
	}),
	ombre_s: new HairAccessory({
		name: 'ombre',
		icon_state: 'hair_ombre_s',
		icon: 'icons/mob/human_face/hair_ombre_s/hair_ombre_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_ombre_s/'
	}),
	parted_s: new HairAccessory({
		name: 'parted',
		icon_state: 'hair_parted_s',
		icon: 'icons/mob/human_face/hair_parted_s/hair_parted_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_parted_s/'
	}),
	pa_s: new HairAccessory({
		name: 'pa',
		icon_state: 'hair_pa_s',
		icon: 'icons/mob/human_face/hair_pa_s/hair_pa_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_pa_s/'
	}),
	pompadour_s: new HairAccessory({
		name: 'pompadour',
		icon_state: 'hair_pompadour_s',
		icon: 'icons/mob/human_face/hair_pompadour_s/hair_pompadour_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_pompadour_s/'
	}),
	ponytail3_s: new HairAccessory({
		name: 'ponytail3',
		icon_state: 'hair_ponytail3_s',
		icon: 'icons/mob/human_face/hair_ponytail3_s/hair_ponytail3_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_ponytail3_s/'
	}),
	ponytail4_s: new HairAccessory({
		name: 'ponytail4',
		icon_state: 'hair_ponytail4_s',
		icon: 'icons/mob/human_face/hair_ponytail4_s/hair_ponytail4_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_ponytail4_s/'
	}),
	ponytail_s: new HairAccessory({
		name: 'ponytail',
		icon_state: 'hair_ponytail_s',
		icon: 'icons/mob/human_face/hair_ponytail_s/hair_ponytail_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_ponytail_s/'
	}),
	poofy_s: new HairAccessory({
		name: 'poofy',
		icon_state: 'hair_poofy_s',
		icon: 'icons/mob/human_face/hair_poofy_s/hair_poofy_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_poofy_s/'
	}),
	quiff_s: new HairAccessory({
		name: 'quiff',
		icon_state: 'hair_quiff_s',
		icon: 'icons/mob/human_face/hair_quiff_s/hair_quiff_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_quiff_s/'
	}),
	reversemohawk_s: new HairAccessory({
		name: 'reversemohawk',
		icon_state: 'hair_reversemohawk_s',
		icon: 'icons/mob/human_face/hair_reversemohawk_s/hair_reversemohawk_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_reversemohawk_s/'
	}),
	sargeant_s: new HairAccessory({
		name: 'sargeant',
		icon_state: 'hair_sargeant_s',
		icon: 'icons/mob/human_face/hair_sargeant_s/hair_sargeant_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_sargeant_s/'
	}),
	scully_s: new HairAccessory({
		name: 'scully',
		icon_state: 'hair_scully_s',
		icon: 'icons/mob/human_face/hair_scully_s/hair_scully_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_scully_s/'
	}),
	shortbangs_s: new HairAccessory({
		name: 'shortbangs',
		icon_state: 'hair_shortbangs_s',
		icon: 'icons/mob/human_face/hair_shortbangs_s/hair_shortbangs_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_shortbangs_s/'
	}),
	shortbraid_s: new HairAccessory({
		name: 'shortbraid',
		icon_state: 'hair_shortbraid_s',
		icon: 'icons/mob/human_face/hair_shortbraid_s/hair_shortbraid_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_shortbraid_s/'
	}),
	shortovereye_s: new HairAccessory({
		name: 'shortovereye',
		icon_state: 'hair_shortovereye_s',
		icon: 'icons/mob/human_face/hair_shortovereye_s/hair_shortovereye_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_shortovereye_s/'
	}),
	skinhead_s: new HairAccessory({
		name: 'skinhead',
		icon_state: 'hair_skinhead_s',
		icon: 'icons/mob/human_face/hair_skinhead_s/hair_skinhead_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_skinhead_s/'
	}),
	slick_s: new HairAccessory({
		name: 'slick',
		icon_state: 'hair_slick_s',
		icon: 'icons/mob/human_face/hair_slick_s/hair_slick_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_slick_s/'
	}),
	spikey_s: new HairAccessory({
		name: 'spikey',
		icon_state: 'hair_spikey_s',
		icon: 'icons/mob/human_face/hair_spikey_s/hair_spikey_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_spikey_s/'
	}),
	stail_s: new HairAccessory({
		name: 'stail',
		icon_state: 'hair_stail_s',
		icon: 'icons/mob/human_face/hair_stail_s/hair_stail_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_stail_s/'
	}),
	thefamilyman_s: new HairAccessory({
		name: 'thefamilyman',
		icon_state: 'hair_thefamilyman_s',
		icon: 'icons/mob/human_face/hair_thefamilyman_s/hair_thefamilyman_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_thefamilyman_s/'
	}),
	toriyama2_s: new HairAccessory({
		name: 'toriyama2',
		icon_state: 'hair_toriyama2_s',
		icon: 'icons/mob/human_face/hair_toriyama2_s/hair_toriyama2_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_toriyama2_s/'
	}),
	toriyama_s: new HairAccessory({
		name: 'toriyama',
		icon_state: 'hair_toriyama_s',
		icon: 'icons/mob/human_face/hair_toriyama_s/hair_toriyama_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_toriyama_s/'
	}),
	undercut_s: new HairAccessory({
		name: 'undercut',
		icon_state: 'hair_undercut_s',
		icon: 'icons/mob/human_face/hair_undercut_s/hair_undercut_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_undercut_s/'
	}),
	updo_s: new HairAccessory({
		name: 'updo',
		icon_state: 'hair_updo_s',
		icon: 'icons/mob/human_face/hair_updo_s/hair_updo_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_updo_s/'
	}),
	vlongfringe_s: new HairAccessory({
		name: 'vlongfringe',
		icon_state: 'hair_vlongfringe_s',
		icon: 'icons/mob/human_face/hair_vlongfringe_s/hair_vlongfringe_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_vlongfringe_s/'
	}),
	vlong_s: new HairAccessory({
		name: 'vlong',
		icon_state: 'hair_vlong_s',
		icon: 'icons/mob/human_face/hair_vlong_s/hair_vlong_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_vlong_s/'
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'hair_volaju_s',
		icon: 'icons/mob/human_face/hair_volaju_s/hair_volaju_s-dir1.png',
		base_icon: 'icons/mob/human_face/hair_volaju_s/'
	}),

}