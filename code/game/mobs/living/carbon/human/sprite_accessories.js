

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

// more proof tg coders are dumb
// there were duplicate type paths. go figure.
// that means some hair styles got overwritten
module.exports.hair = {
	
	abe_s: new HairAccessory({
		name: 'abe',
		icon_state: 'facial_abe_s',
		icon: 'icons/mob/human_face/abe_s/abe_s/-dir1.png',
		base_icon: 'icons/mob/human_face/abe_s/'
	}),
	chaplin_s: new HairAccessory({
		name: 'chaplin',
		icon_state: 'facial_chaplin_s',
		icon: 'icons/mob/human_face/chaplin_s/chaplin_s/-dir1.png',
		base_icon: 'icons/mob/human_face/chaplin_s/'
	}),
	chin_s: new HairAccessory({
		name: 'chin',
		icon_state: 'facial_chin_s',
		icon: 'icons/mob/human_face/chin_s/chin_s/-dir1.png',
		base_icon: 'icons/mob/human_face/chin_s/'
	}),
	dwarf_s: new HairAccessory({
		name: 'dwarf',
		icon_state: 'facial_dwarf_s',
		icon: 'icons/mob/human_face/dwarf_s/dwarf_s/-dir1.png',
		base_icon: 'icons/mob/human_face/dwarf_s/'
	}),
	elvis_s: new HairAccessory({
		name: 'elvis',
		icon_state: 'facial_elvis_s',
		icon: 'icons/mob/human_face/elvis_s/elvis_s/-dir1.png',
		base_icon: 'icons/mob/human_face/elvis_s/'
	}),
	fullbeard_s: new HairAccessory({
		name: 'fullbeard',
		icon_state: 'facial_fullbeard_s',
		icon: 'icons/mob/human_face/fullbeard_s/fullbeard_s/-dir1.png',
		base_icon: 'icons/mob/human_face/fullbeard_s/'
	}),
	gt_s: new HairAccessory({
		name: 'gt',
		icon_state: 'facial_gt_s',
		icon: 'icons/mob/human_face/gt_s/gt_s/-dir1.png',
		base_icon: 'icons/mob/human_face/gt_s/'
	}),
	hip_s: new HairAccessory({
		name: 'hip',
		icon_state: 'facial_hip_s',
		icon: 'icons/mob/human_face/hip_s/hip_s/-dir1.png',
		base_icon: 'icons/mob/human_face/hip_s/'
	}),
	hogan_s: new HairAccessory({
		name: 'hogan',
		icon_state: 'facial_hogan_s',
		icon: 'icons/mob/human_face/hogan_s/hogan_s/-dir1.png',
		base_icon: 'icons/mob/human_face/hogan_s/'
	}),
	invertedhorns: new HairAccessory({
		name: 'invertedhorns',
		icon_state: 'facial_invertedhorns',
		icon: 'icons/mob/human_face/invertedhorns/invertedhorns/-dir1.png',
		base_icon: 'icons/mob/human_face/invertedhorns/'
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'facial_jensen_s',
		icon: 'icons/mob/human_face/jensen_s/jensen_s/-dir1.png',
		base_icon: 'icons/mob/human_face/jensen_s/'
	}),
	largehorns: new HairAccessory({
		name: 'largehorns',
		icon_state: 'facial_largehorns',
		icon: 'icons/mob/human_face/largehorns/largehorns/-dir1.png',
		base_icon: 'icons/mob/human_face/largehorns/'
	}),
	longbeard_s: new HairAccessory({
		name: 'longbeard',
		icon_state: 'facial_longbeard_s',
		icon: 'icons/mob/human_face/longbeard_s/longbeard_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longbeard_s/'
	}),
	massivehorns: new HairAccessory({
		name: 'massivehorns',
		icon_state: 'facial_massivehorns',
		icon: 'icons/mob/human_face/massivehorns/massivehorns/-dir1.png',
		base_icon: 'icons/mob/human_face/massivehorns/'
	}),
	mediumhorns: new HairAccessory({
		name: 'mediumhorns',
		icon_state: 'facial_mediumhorns',
		icon: 'icons/mob/human_face/mediumhorns/mediumhorns/-dir1.png',
		base_icon: 'icons/mob/human_face/mediumhorns/'
	}),
	neckbeard_s: new HairAccessory({
		name: 'neckbeard',
		icon_state: 'facial_neckbeard_s',
		icon: 'icons/mob/human_face/neckbeard_s/neckbeard_s/-dir1.png',
		base_icon: 'icons/mob/human_face/neckbeard_s/'
	}),
	pointedhorns: new HairAccessory({
		name: 'pointedhorns',
		icon_state: 'facial_pointedhorns',
		icon: 'icons/mob/human_face/pointedhorns/pointedhorns/-dir1.png',
		base_icon: 'icons/mob/human_face/pointedhorns/'
	}),
	selleck_s: new HairAccessory({
		name: 'selleck',
		icon_state: 'facial_selleck_s',
		icon: 'icons/mob/human_face/selleck_s/selleck_s/-dir1.png',
		base_icon: 'icons/mob/human_face/selleck_s/'
	}),
	smallbeard_s: new HairAccessory({
		name: 'smallbeard',
		icon_state: 'facial_smallbeard_s',
		icon: 'icons/mob/human_face/smallbeard_s/smallbeard_s/-dir1.png',
		base_icon: 'icons/mob/human_face/smallbeard_s/'
	}),
	smallhorns: new HairAccessory({
		name: 'smallhorns',
		icon_state: 'facial_smallhorns',
		icon: 'icons/mob/human_face/smallhorns/smallhorns/-dir1.png',
		base_icon: 'icons/mob/human_face/smallhorns/'
	}),
	vandyke_s: new HairAccessory({
		name: 'vandyke',
		icon_state: 'facial_vandyke_s',
		icon: 'icons/mob/human_face/vandyke_s/vandyke_s/-dir1.png',
		base_icon: 'icons/mob/human_face/vandyke_s/'
	}),
	verywise_s: new HairAccessory({
		name: 'verywise',
		icon_state: 'facial_verywise_s',
		icon: 'icons/mob/human_face/verywise_s/verywise_s/-dir1.png',
		base_icon: 'icons/mob/human_face/verywise_s/'
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'facial_volaju_s',
		icon: 'icons/mob/human_face/volaju_s/volaju_s/-dir1.png',
		base_icon: 'icons/mob/human_face/volaju_s/'
	}),
	watson_s: new HairAccessory({
		name: 'watson',
		icon_state: 'facial_watson_s',
		icon: 'icons/mob/human_face/watson_s/watson_s/-dir1.png',
		base_icon: 'icons/mob/human_face/watson_s/'
	}),
	wise_s: new HairAccessory({
		name: 'wise',
		icon_state: 'facial_wise_s',
		icon: 'icons/mob/human_face/wise_s/wise_s/-dir1.png',
		base_icon: 'icons/mob/human_face/wise_s/'
	}),
	afro2_s: new HairAccessory({
		name: 'afro2',
		icon_state: 'hair_afro2_s',
		icon: 'icons/mob/human_face/afro2_s/afro2_s/-dir1.png',
		base_icon: 'icons/mob/human_face/afro2_s/'
	}),
	afro_s: new HairAccessory({
		name: 'afro',
		icon_state: 'hair_afro_s',
		icon: 'icons/mob/human_face/afro_s/afro_s/-dir1.png',
		base_icon: 'icons/mob/human_face/afro_s/'
	}),
	averagejoe_s: new HairAccessory({
		name: 'averagejoe',
		icon_state: 'hair_averagejoe_s',
		icon: 'icons/mob/human_face/averagejoe_s/averagejoe_s/-dir1.png',
		base_icon: 'icons/mob/human_face/averagejoe_s/'
	}),
	a_s: new HairAccessory({
		name: 'a',
		icon_state: 'hair_a_s',
		icon: 'icons/mob/human_face/a_s/a_s/-dir1.png',
		base_icon: 'icons/mob/human_face/a_s/'
	}),
	bedheadv2_s: new HairAccessory({
		name: 'bedheadv2',
		icon_state: 'hair_bedheadv2_s',
		icon: 'icons/mob/human_face/bedheadv2_s/bedheadv2_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bedheadv2_s/'
	}),
	bedheadv3_s: new HairAccessory({
		name: 'bedheadv3',
		icon_state: 'hair_bedheadv3_s',
		icon: 'icons/mob/human_face/bedheadv3_s/bedheadv3_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bedheadv3_s/'
	}),
	bedhead_s: new HairAccessory({
		name: 'bedhead',
		icon_state: 'hair_bedhead_s',
		icon: 'icons/mob/human_face/bedhead_s/bedhead_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bedhead_s/'
	}),
	beehive2_s: new HairAccessory({
		name: 'beehive2',
		icon_state: 'hair_beehive2_s',
		icon: 'icons/mob/human_face/beehive2_s/beehive2_s/-dir1.png',
		base_icon: 'icons/mob/human_face/beehive2_s/'
	}),
	beehive_s: new HairAccessory({
		name: 'beehive',
		icon_state: 'hair_beehive_s',
		icon: 'icons/mob/human_face/beehive_s/beehive_s/-dir1.png',
		base_icon: 'icons/mob/human_face/beehive_s/'
	}),
	bigafro_s: new HairAccessory({
		name: 'bigafro',
		icon_state: 'hair_bigafro_s',
		icon: 'icons/mob/human_face/bigafro_s/bigafro_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bigafro_s/'
	}),
	bobcurl_s: new HairAccessory({
		name: 'bobcurl',
		icon_state: 'hair_bobcurl_s',
		icon: 'icons/mob/human_face/bobcurl_s/bobcurl_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bobcurl_s/'
	}),
	bobcut_s: new HairAccessory({
		name: 'bobcut',
		icon_state: 'hair_bobcut_s',
		icon: 'icons/mob/human_face/bobcut_s/bobcut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bobcut_s/'
	}),
	bowlcut_s: new HairAccessory({
		name: 'bowlcut',
		icon_state: 'hair_bowlcut_s',
		icon: 'icons/mob/human_face/bowlcut_s/bowlcut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bowlcut_s/'
	}),
	bowl_s: new HairAccessory({
		name: 'bowl',
		icon_state: 'hair_bowl_s',
		icon: 'icons/mob/human_face/bowl_s/bowl_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bowl_s/'
	}),
	braid_s: new HairAccessory({
		name: 'braid',
		icon_state: 'hair_braid_s',
		icon: 'icons/mob/human_face/braid_s/braid_s/-dir1.png',
		base_icon: 'icons/mob/human_face/braid_s/'
	}),
	bun_s: new HairAccessory({
		name: 'bun',
		icon_state: 'hair_bun_s',
		icon: 'icons/mob/human_face/bun_s/bun_s/-dir1.png',
		base_icon: 'icons/mob/human_face/bun_s/'
	}),
	buzzcut_s: new HairAccessory({
		name: 'buzzcut',
		icon_state: 'hair_buzzcut_s',
		icon: 'icons/mob/human_face/buzzcut_s/buzzcut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/buzzcut_s/'
	}),
	b_s: new HairAccessory({
		name: 'b',
		icon_state: 'hair_b_s',
		icon: 'icons/mob/human_face/b_s/b_s/-dir1.png',
		base_icon: 'icons/mob/human_face/b_s/'
	}),
	chad_s: new HairAccessory({
		name: 'chad',
		icon_state: 'hair_chad_s',
		icon: 'icons/mob/human_face/chad_s/chad_s/-dir1.png',
		base_icon: 'icons/mob/human_face/chad_s/'
	}),
	cia_s: new HairAccessory({
		name: 'cia',
		icon_state: 'hair_cia_s',
		icon: 'icons/mob/human_face/cia_s/cia_s/-dir1.png',
		base_icon: 'icons/mob/human_face/cia_s/'
	}),
	combover_s: new HairAccessory({
		name: 'combover',
		icon_state: 'hair_combover_s',
		icon: 'icons/mob/human_face/combover_s/combover_s/-dir1.png',
		base_icon: 'icons/mob/human_face/combover_s/'
	}),
	crewcut_s: new HairAccessory({
		name: 'crewcut',
		icon_state: 'hair_crewcut_s',
		icon: 'icons/mob/human_face/crewcut_s/crewcut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/crewcut_s/'
	}),
	curls_s: new HairAccessory({
		name: 'curls',
		icon_state: 'hair_curls_s',
		icon: 'icons/mob/human_face/curls_s/curls_s/-dir1.png',
		base_icon: 'icons/mob/human_face/curls_s/'
	}),
	c_s: new HairAccessory({
		name: 'c',
		icon_state: 'hair_c_s',
		icon: 'icons/mob/human_face/c_s/c_s/-dir1.png',
		base_icon: 'icons/mob/human_face/c_s/'
	}),
	dandypompadour_s: new HairAccessory({
		name: 'dandypompadour',
		icon_state: 'hair_dandypompadour_s',
		icon: 'icons/mob/human_face/dandypompadour_s/dandypompadour_s/-dir1.png',
		base_icon: 'icons/mob/human_face/dandypompadour_s/'
	}),
	devilock_s: new HairAccessory({
		name: 'devilock',
		icon_state: 'hair_devilock_s',
		icon: 'icons/mob/human_face/devilock_s/devilock_s/-dir1.png',
		base_icon: 'icons/mob/human_face/devilock_s/'
	}),
	doublebun_s: new HairAccessory({
		name: 'doublebun',
		icon_state: 'hair_doublebun_s',
		icon: 'icons/mob/human_face/doublebun_s/doublebun_s/-dir1.png',
		base_icon: 'icons/mob/human_face/doublebun_s/'
	}),
	dreads_s: new HairAccessory({
		name: 'dreads',
		icon_state: 'hair_dreads_s',
		icon: 'icons/mob/human_face/dreads_s/dreads_s/-dir1.png',
		base_icon: 'icons/mob/human_face/dreads_s/'
	}),
	drillruru_s: new HairAccessory({
		name: 'drillruru',
		icon_state: 'hair_drillruru_s',
		icon: 'icons/mob/human_face/drillruru_s/drillruru_s/-dir1.png',
		base_icon: 'icons/mob/human_face/drillruru_s/'
	}),
	d_s: new HairAccessory({
		name: 'd',
		icon_state: 'hair_d_s',
		icon: 'icons/mob/human_face/d_s/d_s/-dir1.png',
		base_icon: 'icons/mob/human_face/d_s/'
	}),
	emolong_s: new HairAccessory({
		name: 'emolong',
		icon_state: 'hair_emolong_s',
		icon: 'icons/mob/human_face/emolong_s/emolong_s/-dir1.png',
		base_icon: 'icons/mob/human_face/emolong_s/'
	}),
	emoright_s: new HairAccessory({
		name: 'emoright',
		icon_state: 'hair_emoright_s',
		icon: 'icons/mob/human_face/emoright_s/emoright_s/-dir1.png',
		base_icon: 'icons/mob/human_face/emoright_s/'
	}),
	emo_s: new HairAccessory({
		name: 'emo',
		icon_state: 'hair_emo_s',
		icon: 'icons/mob/human_face/emo_s/emo_s/-dir1.png',
		base_icon: 'icons/mob/human_face/emo_s/'
	}),
	e_s: new HairAccessory({
		name: 'e',
		icon_state: 'hair_e_s',
		icon: 'icons/mob/human_face/e_s/e_s/-dir1.png',
		base_icon: 'icons/mob/human_face/e_s/'
	}),
	fade_s: new HairAccessory({
		name: 'fade',
		icon_state: 'hair_fade_s',
		icon: 'icons/mob/human_face/fade_s/fade_s/-dir1.png',
		base_icon: 'icons/mob/human_face/fade_s/'
	}),
	father_s: new HairAccessory({
		name: 'father',
		icon_state: 'hair_father_s',
		icon: 'icons/mob/human_face/father_s/father_s/-dir1.png',
		base_icon: 'icons/mob/human_face/father_s/'
	}),
	feather_s: new HairAccessory({
		name: 'feather',
		icon_state: 'hair_feather_s',
		icon: 'icons/mob/human_face/feather_s/feather_s/-dir1.png',
		base_icon: 'icons/mob/human_face/feather_s/'
	}),
	flair_s: new HairAccessory({
		name: 'flair',
		icon_state: 'hair_flair_s',
		icon: 'icons/mob/human_face/flair_s/flair_s/-dir1.png',
		base_icon: 'icons/mob/human_face/flair_s/'
	}),
	f_s: new HairAccessory({
		name: 'f',
		icon_state: 'hair_f_s',
		icon: 'icons/mob/human_face/f_s/f_s/-dir1.png',
		base_icon: 'icons/mob/human_face/f_s/'
	}),
	gelled_s: new HairAccessory({
		name: 'gelled',
		icon_state: 'hair_gelled_s',
		icon: 'icons/mob/human_face/gelled_s/gelled_s/-dir1.png',
		base_icon: 'icons/mob/human_face/gelled_s/'
	}),
	gentle_s: new HairAccessory({
		name: 'gentle',
		icon_state: 'hair_gentle_s',
		icon: 'icons/mob/human_face/gentle_s/gentle_s/-dir1.png',
		base_icon: 'icons/mob/human_face/gentle_s/'
	}),
	halfbang_alt_s: new HairAccessory({
		name: 'halfbang_alt',
		icon_state: 'hair_halfbang_alt_s',
		icon: 'icons/mob/human_face/halfbang_alt_s/halfbang_alt_s/-dir1.png',
		base_icon: 'icons/mob/human_face/halfbang_alt_s/'
	}),
	halfbang_s: new HairAccessory({
		name: 'halfbang',
		icon_state: 'hair_halfbang_s',
		icon: 'icons/mob/human_face/halfbang_s/halfbang_s/-dir1.png',
		base_icon: 'icons/mob/human_face/halfbang_s/'
	}),
	halfshaved_s: new HairAccessory({
		name: 'halfshaved',
		icon_state: 'hair_halfshaved_s',
		icon: 'icons/mob/human_face/halfshaved_s/halfshaved_s/-dir1.png',
		base_icon: 'icons/mob/human_face/halfshaved_s/'
	}),
	hbraid_s: new HairAccessory({
		name: 'hbraid',
		icon_state: 'hair_hbraid_s',
		icon: 'icons/mob/human_face/hbraid_s/hbraid_s/-dir1.png',
		base_icon: 'icons/mob/human_face/hbraid_s/'
	}),
	himecut_s: new HairAccessory({
		name: 'himecut',
		icon_state: 'hair_himecut_s',
		icon: 'icons/mob/human_face/himecut_s/himecut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/himecut_s/'
	}),
	hitop_s: new HairAccessory({
		name: 'hitop',
		icon_state: 'hair_hitop_s',
		icon: 'icons/mob/human_face/hitop_s/hitop_s/-dir1.png',
		base_icon: 'icons/mob/human_face/hitop_s/'
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'hair_jensen_s',
		icon: 'icons/mob/human_face/jensen_s/jensen_s/-dir1.png',
		base_icon: 'icons/mob/human_face/jensen_s/'
	}),
	jewlocks_s: new HairAccessory({
		name: 'jewlocks',
		icon_state: 'hair_jewlocks_s',
		icon: 'icons/mob/human_face/jewlocks_s/jewlocks_s/-dir1.png',
		base_icon: 'icons/mob/human_face/jewlocks_s/'
	}),
	joestar_s: new HairAccessory({
		name: 'joestar',
		icon_state: 'hair_joestar_s',
		icon: 'icons/mob/human_face/joestar_s/joestar_s/-dir1.png',
		base_icon: 'icons/mob/human_face/joestar_s/'
	}),
	kagami_s: new HairAccessory({
		name: 'kagami',
		icon_state: 'hair_kagami_s',
		icon: 'icons/mob/human_face/kagami_s/kagami_s/-dir1.png',
		base_icon: 'icons/mob/human_face/kagami_s/'
	}),
	kusanagi_s: new HairAccessory({
		name: 'kusanagi',
		icon_state: 'hair_kusanagi_s',
		icon: 'icons/mob/human_face/kusanagi_s/kusanagi_s/-dir1.png',
		base_icon: 'icons/mob/human_face/kusanagi_s/'
	}),
	longbraid_s: new HairAccessory({
		name: 'longbraid',
		icon_state: 'hair_longbraid_s',
		icon: 'icons/mob/human_face/longbraid_s/longbraid_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longbraid_s/'
	}),
	longeralt2_s: new HairAccessory({
		name: 'longeralt2',
		icon_state: 'hair_longeralt2_s',
		icon: 'icons/mob/human_face/longeralt2_s/longeralt2_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longeralt2_s/'
	}),
	longest_s: new HairAccessory({
		name: 'longest',
		icon_state: 'hair_longest_s',
		icon: 'icons/mob/human_face/longest_s/longest_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longest_s/'
	}),
	longfringe_s: new HairAccessory({
		name: 'longfringe',
		icon_state: 'hair_longfringe_s',
		icon: 'icons/mob/human_face/longfringe_s/longfringe_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longfringe_s/'
	}),
	longovereye_s: new HairAccessory({
		name: 'longovereye',
		icon_state: 'hair_longovereye_s',
		icon: 'icons/mob/human_face/longovereye_s/longovereye_s/-dir1.png',
		base_icon: 'icons/mob/human_face/longovereye_s/'
	}),
	mia_s: new HairAccessory({
		name: 'mia',
		icon_state: 'hair_mia_s',
		icon: 'icons/mob/human_face/mia_s/mia_s/-dir1.png',
		base_icon: 'icons/mob/human_face/mia_s/'
	}),
	mulder_s: new HairAccessory({
		name: 'mulder',
		icon_state: 'hair_mulder_s',
		icon: 'icons/mob/human_face/mulder_s/mulder_s/-dir1.png',
		base_icon: 'icons/mob/human_face/mulder_s/'
	}),
	nitori_s: new HairAccessory({
		name: 'nitori',
		icon_state: 'hair_nitori_s',
		icon: 'icons/mob/human_face/nitori_s/nitori_s/-dir1.png',
		base_icon: 'icons/mob/human_face/nitori_s/'
	}),
	odango_s: new HairAccessory({
		name: 'odango',
		icon_state: 'hair_odango_s',
		icon: 'icons/mob/human_face/odango_s/odango_s/-dir1.png',
		base_icon: 'icons/mob/human_face/odango_s/'
	}),
	ombre_s: new HairAccessory({
		name: 'ombre',
		icon_state: 'hair_ombre_s',
		icon: 'icons/mob/human_face/ombre_s/ombre_s/-dir1.png',
		base_icon: 'icons/mob/human_face/ombre_s/'
	}),
	parted_s: new HairAccessory({
		name: 'parted',
		icon_state: 'hair_parted_s',
		icon: 'icons/mob/human_face/parted_s/parted_s/-dir1.png',
		base_icon: 'icons/mob/human_face/parted_s/'
	}),
	pa_s: new HairAccessory({
		name: 'pa',
		icon_state: 'hair_pa_s',
		icon: 'icons/mob/human_face/pa_s/pa_s/-dir1.png',
		base_icon: 'icons/mob/human_face/pa_s/'
	}),
	pompadour_s: new HairAccessory({
		name: 'pompadour',
		icon_state: 'hair_pompadour_s',
		icon: 'icons/mob/human_face/pompadour_s/pompadour_s/-dir1.png',
		base_icon: 'icons/mob/human_face/pompadour_s/'
	}),
	ponytail3_s: new HairAccessory({
		name: 'ponytail3',
		icon_state: 'hair_ponytail3_s',
		icon: 'icons/mob/human_face/ponytail3_s/ponytail3_s/-dir1.png',
		base_icon: 'icons/mob/human_face/ponytail3_s/'
	}),
	ponytail4_s: new HairAccessory({
		name: 'ponytail4',
		icon_state: 'hair_ponytail4_s',
		icon: 'icons/mob/human_face/ponytail4_s/ponytail4_s/-dir1.png',
		base_icon: 'icons/mob/human_face/ponytail4_s/'
	}),
	ponytail_s: new HairAccessory({
		name: 'ponytail',
		icon_state: 'hair_ponytail_s',
		icon: 'icons/mob/human_face/ponytail_s/ponytail_s/-dir1.png',
		base_icon: 'icons/mob/human_face/ponytail_s/'
	}),
	poofy_s: new HairAccessory({
		name: 'poofy',
		icon_state: 'hair_poofy_s',
		icon: 'icons/mob/human_face/poofy_s/poofy_s/-dir1.png',
		base_icon: 'icons/mob/human_face/poofy_s/'
	}),
	quiff_s: new HairAccessory({
		name: 'quiff',
		icon_state: 'hair_quiff_s',
		icon: 'icons/mob/human_face/quiff_s/quiff_s/-dir1.png',
		base_icon: 'icons/mob/human_face/quiff_s/'
	}),
	reversemohawk_s: new HairAccessory({
		name: 'reversemohawk',
		icon_state: 'hair_reversemohawk_s',
		icon: 'icons/mob/human_face/reversemohawk_s/reversemohawk_s/-dir1.png',
		base_icon: 'icons/mob/human_face/reversemohawk_s/'
	}),
	sargeant_s: new HairAccessory({
		name: 'sargeant',
		icon_state: 'hair_sargeant_s',
		icon: 'icons/mob/human_face/sargeant_s/sargeant_s/-dir1.png',
		base_icon: 'icons/mob/human_face/sargeant_s/'
	}),
	scully_s: new HairAccessory({
		name: 'scully',
		icon_state: 'hair_scully_s',
		icon: 'icons/mob/human_face/scully_s/scully_s/-dir1.png',
		base_icon: 'icons/mob/human_face/scully_s/'
	}),
	shortbangs_s: new HairAccessory({
		name: 'shortbangs',
		icon_state: 'hair_shortbangs_s',
		icon: 'icons/mob/human_face/shortbangs_s/shortbangs_s/-dir1.png',
		base_icon: 'icons/mob/human_face/shortbangs_s/'
	}),
	shortbraid_s: new HairAccessory({
		name: 'shortbraid',
		icon_state: 'hair_shortbraid_s',
		icon: 'icons/mob/human_face/shortbraid_s/shortbraid_s/-dir1.png',
		base_icon: 'icons/mob/human_face/shortbraid_s/'
	}),
	shortovereye_s: new HairAccessory({
		name: 'shortovereye',
		icon_state: 'hair_shortovereye_s',
		icon: 'icons/mob/human_face/shortovereye_s/shortovereye_s/-dir1.png',
		base_icon: 'icons/mob/human_face/shortovereye_s/'
	}),
	skinhead_s: new HairAccessory({
		name: 'skinhead',
		icon_state: 'hair_skinhead_s',
		icon: 'icons/mob/human_face/skinhead_s/skinhead_s/-dir1.png',
		base_icon: 'icons/mob/human_face/skinhead_s/'
	}),
	slick_s: new HairAccessory({
		name: 'slick',
		icon_state: 'hair_slick_s',
		icon: 'icons/mob/human_face/slick_s/slick_s/-dir1.png',
		base_icon: 'icons/mob/human_face/slick_s/'
	}),
	spikey_s: new HairAccessory({
		name: 'spikey',
		icon_state: 'hair_spikey_s',
		icon: 'icons/mob/human_face/spikey_s/spikey_s/-dir1.png',
		base_icon: 'icons/mob/human_face/spikey_s/'
	}),
	stail_s: new HairAccessory({
		name: 'stail',
		icon_state: 'hair_stail_s',
		icon: 'icons/mob/human_face/stail_s/stail_s/-dir1.png',
		base_icon: 'icons/mob/human_face/stail_s/'
	}),
	thefamilyman_s: new HairAccessory({
		name: 'thefamilyman',
		icon_state: 'hair_thefamilyman_s',
		icon: 'icons/mob/human_face/thefamilyman_s/thefamilyman_s/-dir1.png',
		base_icon: 'icons/mob/human_face/thefamilyman_s/'
	}),
	toriyama2_s: new HairAccessory({
		name: 'toriyama2',
		icon_state: 'hair_toriyama2_s',
		icon: 'icons/mob/human_face/toriyama2_s/toriyama2_s/-dir1.png',
		base_icon: 'icons/mob/human_face/toriyama2_s/'
	}),
	toriyama_s: new HairAccessory({
		name: 'toriyama',
		icon_state: 'hair_toriyama_s',
		icon: 'icons/mob/human_face/toriyama_s/toriyama_s/-dir1.png',
		base_icon: 'icons/mob/human_face/toriyama_s/'
	}),
	undercut_s: new HairAccessory({
		name: 'undercut',
		icon_state: 'hair_undercut_s',
		icon: 'icons/mob/human_face/undercut_s/undercut_s/-dir1.png',
		base_icon: 'icons/mob/human_face/undercut_s/'
	}),
	updo_s: new HairAccessory({
		name: 'updo',
		icon_state: 'hair_updo_s',
		icon: 'icons/mob/human_face/updo_s/updo_s/-dir1.png',
		base_icon: 'icons/mob/human_face/updo_s/'
	}),
	vlongfringe_s: new HairAccessory({
		name: 'vlongfringe',
		icon_state: 'hair_vlongfringe_s',
		icon: 'icons/mob/human_face/vlongfringe_s/vlongfringe_s/-dir1.png',
		base_icon: 'icons/mob/human_face/vlongfringe_s/'
	}),
	vlong_s: new HairAccessory({
		name: 'vlong',
		icon_state: 'hair_vlong_s',
		icon: 'icons/mob/human_face/vlong_s/vlong_s/-dir1.png',
		base_icon: 'icons/mob/human_face/vlong_s/'
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'hair_volaju_s',
		icon: 'icons/mob/human_face/volaju_s/volaju_s/-dir1.png',
		base_icon: 'icons/mob/human_face/volaju_s/'
	}),
	black: new HairAccessory({
		name: 'black',
		icon_state: 'lips_black',
		icon: 'icons/mob/human_face/black/black/-dir1.png',
		base_icon: 'icons/mob/human_face/black/'
	}),
	black_fat: new HairAccessory({
		name: 'black_fat',
		icon_state: 'lips_black_fat',
		icon: 'icons/mob/human_face/black_fat/black_fat/-dir1.png',
		base_icon: 'icons/mob/human_face/black_fat/'
	}),
	black_slim: new HairAccessory({
		name: 'blacklim',
		icon_state: 'lips_black_slim',
		icon: 'icons/mob/human_face/black_slim/black_slim/-dir1.png',
		base_icon: 'icons/mob/human_face/black_slim/'
	}),
	jade: new HairAccessory({
		name: 'jade',
		icon_state: 'lips_jade',
		icon: 'icons/mob/human_face/jade/jade/-dir1.png',
		base_icon: 'icons/mob/human_face/jade/'
	}),
	jade_fat: new HairAccessory({
		name: 'jade fat',
		icon_state: 'lips_jade_fat',
		icon: 'icons/mob/human_face/jade_fat/jade_fat/-dir1.png',
		base_icon: 'icons/mob/human_face/jade_fat/'
	}),
	jade_slim: new HairAccessory({
		name: 'jadelim',
		icon_state: 'lips_jade_slim',
		icon: 'icons/mob/human_face/jade_slim/jade_slim/-dir1.png',
		base_icon: 'icons/mob/human_face/jade_slim/'
	}),
	purple: new HairAccessory({
		name: 'purple',
		icon_state: 'lips_purple',
		icon: 'icons/mob/human_face/purple/purple/-dir1.png',
		base_icon: 'icons/mob/human_face/purple/'
	}),
	purple_fat: new HairAccessory({
		name: 'purple_fat',
		icon_state: 'lips_purple_fat',
		icon: 'icons/mob/human_face/purple_fat/purple_fat/-dir1.png',
		base_icon: 'icons/mob/human_face/purple_fat/'
	}),
	purple_slim: new HairAccessory({
		name: 'purplelim',
		icon_state: 'lips_purple_slim',
		icon: 'icons/mob/human_face/purple_slim/purple_slim/-dir1.png',
		base_icon: 'icons/mob/human_face/purple_slim/'
	}),
	red: new HairAccessory({
		name: 'red',
		icon_state: 'lips_red',
		icon: 'icons/mob/human_face/red/red/-dir1.png',
		base_icon: 'icons/mob/human_face/red/'
	}),
	red_fat: new HairAccessory({
		name: 'red fat',
		icon_state: 'lips_red_fat',
		icon: 'icons/mob/human_face/red_fat/red_fat/-dir1.png',
		base_icon: 'icons/mob/human_face/red_fat/'
	}),
	red_slim: new HairAccessory({
		name: 'red slim',
		icon_state: 'lips_red_slim',
		icon: 'icons/mob/human_face/red_slim/red_slim/-dir1.png',
		base_icon: 'icons/mob/human_face/red_slim/'
	})
}
