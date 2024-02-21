import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	addParticipation,
	getParticipation,
	updateParticipation
} from '$lib/supabase/participation';

export const load: PageServerLoad = async ({ params, locals: { getSession, supabase } }) => {
	const session = await getSession();
	const { code } = params;
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data, error: err } = await supabase
		.from('games')
		.select(
			'id, code, creator, end_at, is_active, name, cooldown_hours, participation ( id, score, total_score, profile_id, updated_at, nickname )'
		)
		.eq('code', code)
		.single();

	if (!data) {
		error(404, { message: `Game ${code} not found` });
	}

	if (err) {
		error(500, { message: err });
	}

	const currentPlayer = data.participation.find((p) => p.profile_id === session.user.id);
	return {
		endsAt: data.end_at,
		gameId: data.id,
		gameName: data.name,
		cooldownHours: data.cooldown_hours,
		players: data.participation,
		currentPlayer
	};
};

export const actions = {
	updateScore: async ({ request, locals: { getSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const scoreInput = formData.get('2fa-score');
		const isParticipating = formData.get('is-participating') === 'true';
		const game_id = formData.get('game-id');
		const session = await getSession();

		if (!session) {
			return fail(401, {
				nickname,
				score: scoreInput,
				message: 'No login session found. Please login and try again.'
			});
		}

		if (!scoreInput) {
			return fail(400, {
				nickname,
				score: scoreInput,
				message: 'Invalid score value. Please try again.'
			});
		}
		const score = parseInt(scoreInput.toString(), 10);

		if (!isParticipating) {
			const addParticipationRes = await addParticipation(
				game_id!.toString(),
				session.user.id,
				nickname!.toString(),
				score
			);

			if (addParticipationRes.type === 'error') {
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}

			return {
				message: createSuccessMessage(score)
			};
		} else {
			const res = await getParticipation(session.user.id, game_id!.toString());
			if (res.type === 'error') {
				console.error('Error getting existing participation', JSON.stringify(res.error));
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}
			const { data: participation } = res;

			const updateParticipationRes = await updateParticipation(score, participation);

			if (updateParticipationRes.type === 'error') {
				console.error('Error updating score', JSON.stringify(error));
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}

			return {
				message: createSuccessMessage(score)
			};
		}
	}
};

const extremelyBadScore = [
	"🕷️ Spidey's Web Mix-Up: Spider-Man mistook you for a villain, and now you're stuck in a web of awkward explanations.",
	"⚰️ Dementor's Hug: A Dementor, looking for Harry, gave you an unexpected chilling hug.",
	"🤖 R2-D2's Prank Call: R2-D2 hacked your communicator, sending embarrassing messages across the galaxy.",
	"🍄 Wonderland Mini-Party: You shrunk down for the Mad Hatter's tea party, where the Cheshire Cat tells jokes.",
	"👻 Slimer's Sidekick: Slimer won't stop following you, leaving a trail of ectoplasmic mischief.",
	"🚫 Gollum's Mix-Up: Gollum thinks you're his 'Precious,' leading to some awkward conversations.",
	"🌪️ Toto's Tornado: Toto triggered a tornado, landing you in Oz with flying monkey trouble.",
	"🔮 Dumbledore's Levitation: Dumbledore's spell causes objects to levitate around you unexpectedly.",
	"🤯 Jar Jar's Hero: Your Jedi mind trick accidentally convinced everyone Jar Jar is a galactic hero.",
	"🚶‍♂️ Hobbit-sized Day: Gandalf's staff turned you into a hobbit for the day, facing unexpected challenges."
];
const badScore = [
	"🌧️ Weather Wizard's Surprise: A minor spell mishap by the Weather Wizard, and now it's raining indoors.",
	'🧙‍♂️ Wizard Apprentice Woes: Your attempt at a simple spell accidentally summoned magical chaos in the neighborhood.',
	'🚢 Pirate Parley: Captained by Captain Jack Sparrow, you find yourself entangled in a pirate negotiation for an invisible treasure.',
	'🕸️ Elven Hair Salon: The mischievous elves decided to style your hair with intricate, but somewhat uncomfortable, braids.',
	'🕰️ Time-Travel Fumble: A time-turner mishap leaves you attending your own past awkward moments. Time to face those cringe-worthy encounters!',
	"🍄 Mushroom Fairy Market: You've stumbled into a fairy market where your coins mysteriously transform into glittering mushrooms.",
	"🌈 Unicorn's Prank: A unicorn pranked you by painting rainbow stripes on your clothes. Stylish or embarrassing, you decide!",
	'🧚‍♀️ Fairy Dust Overload: Accidentally spilled fairy dust turns everyday objects into whimsical, yet slightly inconvenient, magical items.',
	"🏹 Archer's Apprentice: Trying archery with Legolas, you manage to hit the bullseye, but also your own foot. Ouch!",
	'🦄 Pegasus Ride Misadventure: Your attempt to ride a Pegasus results in an unexpected aerial tour of the fantasy realm, minus the graceful landing.'
];

const middleScore = [
	"🍵 Tea with Dragons: You've been invited to a tea party with friendly dragons – they're surprisingly good hosts!",
	"📚 Bookworm's Dilemma: Accidentally wandered into a library with sentient books that insist on being read out loud.",
	'🎨 Artistic Goblins: Goblins redecorated your living room with abstract art while you were away – they have unique taste!',
	"🎉 Fairy Birthday Bash: Fairies decided it's your 'un-birthday' and threw a surprise celebration in your backyard.",
	'🚀 Spaceship Repair: Found yourself on a spaceship and got enlisted to fix a minor technical glitch by a friendly alien crew.',
	'🛡️ Friendly Duel: A knight challenges you to a friendly duel using pool noodles as swords – medieval meets modern fun!',
	"🎤 Singing Mermaids: Mermaids organized an underwater karaoke party, and you're invited to showcase your sea shanty skills.",
	"🌳 Talking Trees: Trees in the enchanted forest start sharing ancient wisdom when you pass by – nature's chatty day.",
	'🍔 Gourmet Goblin Kitchen: Goblins sneak into your kitchen to prepare an elaborate, albeit unconventional, feast.',
	'🚲 Flying Broomstick Lesson: Accidentally stumbled upon a flying broomstick riding school – balancing act, anyone?'
];

const goodScore = [
	'🌟 Starry Celebration: A constellation of stars aligns overhead, marking a joyous and fortunate occasion.',
	'🎭 Impromptu Street Performance: Acrobats and jesters turn your neighborhood into a spontaneous carnival of laughter and amazement.',
	'🌺 Blossoming Enchantment: Flowers in the enchanted garden bloom in a spectacular display of vibrant colors just for you.',
	'🏰 Castle Picnic: Stumble upon a hidden castle where friendly royalty invites you to a grand feast in the courtyard.',
	'🦄 Unicorn Parade: A magical parade of unicorns marches through town, spreading joy and sparkles in their wake.',
	'🌈 Rainbow Bridge: Cross a bridge made of rainbows, leading you to a mythical land where dreams come true.',
	"🎶 Melodic Faerie Dance: Faeries organize a lively dance party, and you're invited to join the enchanted celebration.",
	'🌠 Wish-Granting Comet: Witness a shooting star that grants a wish, making your dreams come alive.',
	'🚀 Celestial Voyage: Embark on a cosmic journey aboard a starship, exploring the wonders of the universe.',
	'🌊 Mermaid Serenade: Mermaids serenade you with a captivating underwater concert, filling the sea with beautiful melodies.'
];

const extremlyGoodScore = [
	'🌌 Cosmic Revelations: The universe reveals its secrets, granting you profound wisdom and cosmic insight.',
	" 🌟 Celestial Coronation: Crowned by celestial beings, you're honored as a starlight guardian of the cosmos.",
	'🌈 Rainbow Symphony: A symphony of rainbows fills the sky, creating a breathtaking display of color and light.',
	'🚀 Time-Travel Triumph: Stumble upon a time-travel portal, granting you the chance to witness historical marvels firsthand.',
	"🔮 Wizard's Apprentice: A renowned wizard selects you as their apprentice, revealing the secrets of ancient magic.",
	'🏰 Dragon Flight: Soar through the skies on the back of a majestic dragon, experiencing breathtaking aerial views.',
	"🌌 Galactic Ambassador: Aliens visit Earth, and you're chosen as the ambassador for an intergalactic friendship treaty.",
	'🎇 Celestial Fireworks: Witness a cosmic fireworks display as constellations celebrate your incredible achievements.',
	"🌍 Earth Elemental's Blessing: Connect with an Earth Elemental, receiving their blessing for harmony and balance in your life.",
	"🏆 Hero's Recognition: Your heroic deeds catch the attention of legendary heroes, and they invite you to join their elite ranks.",
	'🛡️ Magical Armor Forging: Craft a set of legendary magical armor, providing unparalleled protection and style.',
	"🧙‍♂️ Sorcerer's Grand Illusion: Master the art of illusion with a sorcerer, creating mesmerizing spectacles that dazzle the world.",
	'🌈 Rainbow Bridge to Bliss: Walk across a radiant rainbow bridge, leading to a realm of pure joy and boundless possibilities.'
];

const topScore = [
	'👑 Ascension to Immortality: Achieve a state of transcendence, becoming an immortal being with boundless wisdom and power.',
	'🌌 Cosmic Architect: Gain the ability to shape galaxies, becoming the architect of the cosmos and crafting celestial wonders at will.',
	'🌟 Starlight Symphony: Conduct a symphony of stars, creating a mesmerizing cosmic harmony that resonates throughout the universe.',
	'🌈 Reality Weaver: Master the art of reality manipulation, allowing you to reshape existence and manifest your wildest dreams.',
	'🚀 Time Lord Mastery: Attain mastery over time itself, navigating the past, present, and future with unparalleled precision and understanding.'
];

const worstScore = [
	'☠️ Curse of Eternal Shadows: Fall victim to a malevolent curse, condemning you to eternal darkness and isolation.',
	'🌀 Abyssal Void Trap: Stumble into an abyssal void, trapping you in a dimension of perpetual emptiness and despair.',
	"💀 Grim Reaper's Embrace: Encounter the Grim Reaper, who insists on an untimely journey to the afterlife.",
	'🌑 Eclipse of Hope: Experience an eclipse that drains all hope from your surroundings, plunging you into profound desolation.',
	'🔗 Chains of Fate: Become entangled in the unbreakable chains of fate, ensuring a future of continuous struggle and hardship.'
];

const createSuccessMessage = (score: number) => {
	if (score >= 99) return topScore[Math.floor(Math.random() * topScore.length)];
	if (score >= 80) return extremlyGoodScore[Math.floor(Math.random() * extremlyGoodScore.length)];
	if (score === 69)
		return '👀 A mysterious number appears, leaving you with a knowing smile. Nice.';
	if (score >= 60) return goodScore[Math.floor(Math.random() * goodScore.length)];
	if (score >= 40) return middleScore[Math.floor(Math.random() * middleScore.length)];
	if (score >= 20) return badScore[Math.floor(Math.random() * badScore.length)];
	if (score >= 2) return extremelyBadScore[Math.floor(Math.random() * extremelyBadScore.length)];
	return worstScore[Math.floor(Math.random() * worstScore.length)];
};
