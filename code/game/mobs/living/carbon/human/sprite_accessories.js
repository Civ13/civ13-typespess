

class SpriteAccessory {
	constructor(obj) {
		Object.assign(
			this,
			{
				icon: "icons/mob/human_face/",
				icon_state: "bald_s",
				directional: true,
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
		obj.icon = obj.hasOwnProperty("icon_state")
			? obj.icon_state
			: "bald_s";
		super(obj);
		this.icon = "icons/mob/human_face/";
		this.directional = true;
	}
}

// more proof tg coders are dumb
// there were duplicate type paths. go figure.
// that means some hair styles got overwritten
module.exports.hair = {
	bald_s: new HairAccessory({
		name: 'bald',
		icon_state: 'bald_s',
	}),
	abe_s: new HairAccessory({
		name: 'abe',
		icon_state: 'facial_abe_s',
	}),
	chaplin_s: new HairAccessory({
		name: 'chaplin',
		icon_state: 'facial_chaplin_s',
	}),
	chin_s: new HairAccessory({
		name: 'chin',
		icon_state: 'facial_chin_s',
	}),
	dwarf_s: new HairAccessory({
		name: 'dwarf',
		icon_state: 'facial_dwarf_s',
	}),
	elvis_s: new HairAccessory({
		name: 'elvis',
		icon_state: 'facial_elvis_s',
	}),
	fullbeard_s: new HairAccessory({
		name: 'fullbeard',
		icon_state: 'facial_fullbeard_s',
	}),
	gt_s: new HairAccessory({
		name: 'gt',
		icon_state: 'facial_gt_s',
	}),
	hip_s: new HairAccessory({
		name: 'hip',
		icon_state: 'facial_hip_s',
	}),
	hogan_s: new HairAccessory({
		name: 'hogan',
		icon_state: 'facial_hogan_s',
	}),
	invertedhorns: new HairAccessory({
		name: 'invertedhorns',
		icon_state: 'facial_invertedhorns',
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'facial_jensen_s',
	}),
	largehorns: new HairAccessory({
		name: 'largehorns',
		icon_state: 'facial_largehorns',
	}),
	longbeard_s: new HairAccessory({
		name: 'longbeard',
		icon_state: 'facial_longbeard_s',
	}),
	massivehorns: new HairAccessory({
		name: 'massivehorns',
		icon_state: 'facial_massivehorns',
	}),
	mediumhorns: new HairAccessory({
		name: 'mediumhorns',
		icon_state: 'facial_mediumhorns',
	}),
	neckbeard_s: new HairAccessory({
		name: 'neckbeard',
		icon_state: 'facial_neckbeard_s',
	}),
	pointedhorns: new HairAccessory({
		name: 'pointedhorns',
		icon_state: 'facial_pointedhorns',
	}),
	selleck_s: new HairAccessory({
		name: 'selleck',
		icon_state: 'facial_selleck_s',
	}),
	smallbeard_s: new HairAccessory({
		name: 'smallbeard',
		icon_state: 'facial_smallbeard_s',
	}),
	smallhorns: new HairAccessory({
		name: 'smallhorns',
		icon_state: 'facial_smallhorns',
	}),
	vandyke_s: new HairAccessory({
		name: 'vandyke',
		icon_state: 'facial_vandyke_s',
	}),
	verywise_s: new HairAccessory({
		name: 'verywise',
		icon_state: 'facial_verywise_s',
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'facial_volaju_s',
	}),
	watson_s: new HairAccessory({
		name: 'watson',
		icon_state: 'facial_watson_s',
	}),
	wise_s: new HairAccessory({
		name: 'wise',
		icon_state: 'facial_wise_s',
	}),
	afro2_s: new HairAccessory({
		name: 'afro2',
		icon_state: 'hair_afro2_s',
	}),
	afro_s: new HairAccessory({
		name: 'afro',
		icon_state: 'hair_afro_s',
	}),
	averagejoe_s: new HairAccessory({
		name: 'averagejoe',
		icon_state: 'hair_averagejoe_s',
	}),
	a_s: new HairAccessory({
		name: 'a',
		icon_state: 'hair_a_s',
	}),
	bedheadv2_s: new HairAccessory({
		name: 'bedheadv2',
		icon_state: 'hair_bedheadv2_s',
	}),
	bedheadv3_s: new HairAccessory({
		name: 'bedheadv3',
		icon_state: 'hair_bedheadv3_s',
	}),
	bedhead_s: new HairAccessory({
		name: 'bedhead',
		icon_state: 'hair_bedhead_s',
	}),
	beehive2_s: new HairAccessory({
		name: 'beehive2',
		icon_state: 'hair_beehive2_s',
	}),
	beehive_s: new HairAccessory({
		name: 'beehive',
		icon_state: 'hair_beehive_s',
	}),
	bigafro_s: new HairAccessory({
		name: 'bigafro',
		icon_state: 'hair_bigafro_s',
	}),
	bobcurl_s: new HairAccessory({
		name: 'bobcurl',
		icon_state: 'hair_bobcurl_s',
	}),
	bobcut_s: new HairAccessory({
		name: 'bobcut',
		icon_state: 'hair_bobcut_s',
	}),
	bowlcut_s: new HairAccessory({
		name: 'bowlcut',
		icon_state: 'hair_bowlcut_s',
	}),
	bowl_s: new HairAccessory({
		name: 'bowl',
		icon_state: 'hair_bowl_s',
	}),
	braid_s: new HairAccessory({
		name: 'braid',
		icon_state: 'hair_braid_s',
	}),
	bun_s: new HairAccessory({
		name: 'bun',
		icon_state: 'hair_bun_s',
	}),
	buzzcut_s: new HairAccessory({
		name: 'buzzcut',
		icon_state: 'hair_buzzcut_s',
	}),
	b_s: new HairAccessory({
		name: 'b',
		icon_state: 'hair_b_s',
	}),
	chad_s: new HairAccessory({
		name: 'chad',
		icon_state: 'hair_chad_s',
	}),
	cia_s: new HairAccessory({
		name: 'cia',
		icon_state: 'hair_cia_s',
	}),
	combover_s: new HairAccessory({
		name: 'combover',
		icon_state: 'hair_combover_s',
	}),
	crewcut_s: new HairAccessory({
		name: 'crewcut',
		icon_state: 'hair_crewcut_s',
	}),
	curls_s: new HairAccessory({
		name: 'curls',
		icon_state: 'hair_curls_s',
	}),
	c_s: new HairAccessory({
		name: 'c',
		icon_state: 'hair_c_s',
	}),
	dandypompadour_s: new HairAccessory({
		name: 'dandypompadour',
		icon_state: 'hair_dandypompadour_s',
	}),
	devilock_s: new HairAccessory({
		name: 'devilock',
		icon_state: 'hair_devilock_s',
	}),
	doublebun_s: new HairAccessory({
		name: 'doublebun',
		icon_state: 'hair_doublebun_s',
	}),
	dreads_s: new HairAccessory({
		name: 'dreads',
		icon_state: 'hair_dreads_s',
	}),
	drillruru_s: new HairAccessory({
		name: 'drillruru',
		icon_state: 'hair_drillruru_s',
	}),
	d_s: new HairAccessory({
		name: 'd',
		icon_state: 'hair_d_s',
	}),
	emolong_s: new HairAccessory({
		name: 'emolong',
		icon_state: 'hair_emolong_s',
	}),
	emoright_s: new HairAccessory({
		name: 'emoright',
		icon_state: 'hair_emoright_s',
	}),
	emo_s: new HairAccessory({
		name: 'emo',
		icon_state: 'hair_emo_s',
	}),
	e_s: new HairAccessory({
		name: 'e',
		icon_state: 'hair_e_s',
	}),
	fade_s: new HairAccessory({
		name: 'fade',
		icon_state: 'hair_fade_s',
	}),
	father_s: new HairAccessory({
		name: 'father',
		icon_state: 'hair_father_s',
	}),
	feather_s: new HairAccessory({
		name: 'feather',
		icon_state: 'hair_feather_s',
	}),
	flair_s: new HairAccessory({
		name: 'flair',
		icon_state: 'hair_flair_s',
	}),
	f_s: new HairAccessory({
		name: 'f',
		icon_state: 'hair_f_s',
	}),
	gelled_s: new HairAccessory({
		name: 'gelled',
		icon_state: 'hair_gelled_s',
	}),
	gentle_s: new HairAccessory({
		name: 'gentle',
		icon_state: 'hair_gentle_s',
	}),
	halfbang_alt_s: new HairAccessory({
		name: 'halfbang_alt',
		icon_state: 'hair_halfbang_alt_s',
	}),
	halfbang_s: new HairAccessory({
		name: 'halfbang',
		icon_state: 'hair_halfbang_s',
	}),
	halfshaved_s: new HairAccessory({
		name: 'halfshaved',
		icon_state: 'hair_halfshaved_s',
	}),
	hbraid_s: new HairAccessory({
		name: 'hbraid',
		icon_state: 'hair_hbraid_s',
	}),
	himecut_s: new HairAccessory({
		name: 'himecut',
		icon_state: 'hair_himecut_s',
	}),
	hitop_s: new HairAccessory({
		name: 'hitop',
		icon_state: 'hair_hitop_s',
	}),
	jensen_s: new HairAccessory({
		name: 'jensen',
		icon_state: 'hair_jensen_s',
	}),
	jewlocks_s: new HairAccessory({
		name: 'jewlocks',
		icon_state: 'hair_jewlocks_s',
	}),
	joestar_s: new HairAccessory({
		name: 'joestar',
		icon_state: 'hair_joestar_s',
	}),
	kagami_s: new HairAccessory({
		name: 'kagami',
		icon_state: 'hair_kagami_s',
	}),
	kusanagi_s: new HairAccessory({
		name: 'kusanagi',
		icon_state: 'hair_kusanagi_s',
	}),
	longbraid_s: new HairAccessory({
		name: 'longbraid',
		icon_state: 'hair_longbraid_s',
	}),
	longeralt2_s: new HairAccessory({
		name: 'longeralt2',
		icon_state: 'hair_longeralt2_s',
	}),
	longest_s: new HairAccessory({
		name: 'longest',
		icon_state: 'hair_longest_s',
	}),
	longfringe_s: new HairAccessory({
		name: 'longfringe',
		icon_state: 'hair_longfringe_s',
	}),
	longovereye_s: new HairAccessory({
		name: 'longovereye',
		icon_state: 'hair_longovereye_s',
	}),
	mia_s: new HairAccessory({
		name: 'mia',
		icon_state: 'hair_mia_s',
	}),
	mulder_s: new HairAccessory({
		name: 'mulder',
		icon_state: 'hair_mulder_s',
	}),
	nitori_s: new HairAccessory({
		name: 'nitori',
		icon_state: 'hair_nitori_s',
	}),
	odango_s: new HairAccessory({
		name: 'odango',
		icon_state: 'hair_odango_s',
	}),
	ombre_s: new HairAccessory({
		name: 'ombre',
		icon_state: 'hair_ombre_s',
	}),
	parted_s: new HairAccessory({
		name: 'parted',
		icon_state: 'hair_parted_s',
	}),
	pa_s: new HairAccessory({
		name: 'pa',
		icon_state: 'hair_pa_s',
	}),
	pompadour_s: new HairAccessory({
		name: 'pompadour',
		icon_state: 'hair_pompadour_s',
	}),
	ponytail3_s: new HairAccessory({
		name: 'ponytail3',
		icon_state: 'hair_ponytail3_s',
	}),
	ponytail4_s: new HairAccessory({
		name: 'ponytail4',
		icon_state: 'hair_ponytail4_s',
	}),
	ponytail_s: new HairAccessory({
		name: 'ponytail',
		icon_state: 'hair_ponytail_s',
	}),
	poofy_s: new HairAccessory({
		name: 'poofy',
		icon_state: 'hair_poofy_s',
	}),
	quiff_s: new HairAccessory({
		name: 'quiff',
		icon_state: 'hair_quiff_s',
	}),
	reversemohawk_s: new HairAccessory({
		name: 'reversemohawk',
		icon_state: 'hair_reversemohawk_s',
	}),
	sargeant_s: new HairAccessory({
		name: 'sargeant',
		icon_state: 'hair_sargeant_s',
	}),
	scully_s: new HairAccessory({
		name: 'scully',
		icon_state: 'hair_scully_s',
	}),
	shortbangs_s: new HairAccessory({
		name: 'shortbangs',
		icon_state: 'hair_shortbangs_s',
	}),
	shortbraid_s: new HairAccessory({
		name: 'shortbraid',
		icon_state: 'hair_shortbraid_s',
	}),
	shortovereye_s: new HairAccessory({
		name: 'shortovereye',
		icon_state: 'hair_shortovereye_s',
	}),
	skinhead_s: new HairAccessory({
		name: 'skinhead',
		icon_state: 'hair_skinhead_s',
	}),
	slick_s: new HairAccessory({
		name: 'slick',
		icon_state: 'hair_slick_s',
	}),
	spikey_s: new HairAccessory({
		name: 'spikey',
		icon_state: 'hair_spikey_s',
	}),
	stail_s: new HairAccessory({
		name: 'stail',
		icon_state: 'hair_stail_s',
	}),
	thefamilyman_s: new HairAccessory({
		name: 'thefamilyman',
		icon_state: 'hair_thefamilyman_s',
	}),
	toriyama2_s: new HairAccessory({
		name: 'toriyama2',
		icon_state: 'hair_toriyama2_s',
	}),
	toriyama_s: new HairAccessory({
		name: 'toriyama',
		icon_state: 'hair_toriyama_s',
	}),
	undercut_s: new HairAccessory({
		name: 'undercut',
		icon_state: 'hair_undercut_s',
	}),
	updo_s: new HairAccessory({
		name: 'updo',
		icon_state: 'hair_updo_s',
	}),
	vlongfringe_s: new HairAccessory({
		name: 'vlongfringe',
		icon_state: 'hair_vlongfringe_s',
	}),
	vlong_s: new HairAccessory({
		name: 'vlong',
		icon_state: 'hair_vlong_s',
	}),
	volaju_s: new HairAccessory({
		name: 'volaju',
		icon_state: 'hair_volaju_s',
	}),
	black: new HairAccessory({
		name: 'black',
		icon_state: 'lips_black',
	}),
	black_fat: new HairAccessory({
		name: 'black_fat',
		icon_state: 'lips_black_fat',
	}),
	black_slim: new HairAccessory({
		name: 'blacklim',
		icon_state: 'lips_black_slim',
	}),
	jade: new HairAccessory({
		name: 'jade',
		icon_state: 'lips_jade',
	}),
	jade_fat: new HairAccessory({
		name: 'jade fat',
		icon_state: 'lips_jade_fat',
	}),
	jade_slim: new HairAccessory({
		name: 'jadelim',
		icon_state: 'lips_jade_slim',
	}),
	purple: new HairAccessory({
		name: 'purple',
		icon_state: 'lips_purple',
	}),
	purple_fat: new HairAccessory({
		name: 'purple_fat',
		icon_state: 'lips_purple_fat',
	}),
	purple_slim: new HairAccessory({
		name: 'purplelim',
		icon_state: 'lips_purple_slim',
	}),
	red: new HairAccessory({
		name: 'red',
		icon_state: 'lips_red',
	}),
	red_fat: new HairAccessory({
		name: 'red fat',
		icon_state: 'lips_red_fat',
	}),
	red_slim: new HairAccessory({
		name: 'red slim',
		icon_state: 'lips_red_slim',

	})
}
