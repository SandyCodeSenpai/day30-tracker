/* ===== 4-WEEK BEGINNER HOME CALISTHENICS PLAN — DATA ===== */
/* Pose fields (all degrees except x,y):
   x,y  hip offset   rot  whole-body rotation (pivot hip)
   torso  lean (+ forward)   uL/uR upper arm (− forward)  fL/fR forearm (− flexion)
   tL/tR thigh (− forward)   sL/sR shin (+ knee bend)
   Right-side limbs default to the left values. */

const EX = {
  /* ---------- WARM-UP ---------- */
  march: {
    name: 'March in place', group: 'Warm-up', dose: '2 minutes', rest: 0,
    cues: ['Tall posture, relaxed shoulders', 'Swing the arms naturally', 'Easy breathing, this is a warm-up'],
    anim: { dur: 600, poses: [
      { tL: -55, sL: 65, tR: 5, sR: 5, uL: 30, fL: -30, uR: -35, fR: -50 },
      { tL: 5, sL: 5, tR: -55, sR: 65, uL: -35, fL: -50, uR: 30, fR: -30 } ] }
  },
  pendulum: {
    name: 'Shoulder pendulum', group: 'Warm-up', dose: '10 circles each direction, per arm', rest: 0,
    cues: ['Lean forward, support yourself on a chair with the other hand', 'Let the arm hang completely relaxed', 'Small circles, let momentum move it, do not muscle it'],
    anim: { dur: 900, props: ['chair-front'], poses: [
      { torso: 45, x: -10, tL: -10, sL: 15, uR: -115, fR: -10, uL: -30, fL: 0 },
      { torso: 45, x: -10, tL: -10, sL: 15, uR: -115, fR: -10, uL: -65, fL: 0 } ] }
  },
  scap_squeeze: {
    name: 'Shoulder blade squeeze', group: 'Warm-up', dose: '10 reps, 2 s hold', rest: 0,
    cues: ['Elbows bent at your sides', 'Pull shoulder blades back and down toward the back pockets', 'Do NOT shrug up. Hold 2 seconds, release slowly'],
    anim: { dur: 1400, poses: [
      { uL: 0, fL: -90, torso: 2 },
      { uL: 22, fL: -95, torso: -4 } ] }
  },
  wall_slide: {
    name: 'Wall slide', group: 'Warm-up', dose: '8 reps', rest: 0,
    cues: ['Back and head lightly against the wall', 'Arms in a goal-post shape, slide up only as far as feels comfortable', 'Keep ribs down, do not arch the lower back', 'Left shoulder: stop where it complains'],
    anim: { dur: 1600, props: ['wall-back'], poses: [
      { uL: -100, fL: -80 },
      { uL: -165, fL: -15 } ] }
  },
  squat_bw: {
    name: 'Bodyweight squat', group: 'Warm-up', dose: '10 reps', rest: 0,
    cues: ['Feet shoulder width, toes slightly out', 'Hips back and down, chest up', 'Knees track over the toes'],
    anim: { dur: 1300, poses: [
      { uL: -25, fL: -110 },
      { x: -30, y: 32, torso: 40, tL: -85, sL: 85, uL: -130, fL: -5 } ] }
  },
  hinge: {
    name: 'Hip hinge', group: 'Warm-up', dose: '10 reps', rest: 0,
    cues: ['Soft knees, push hips straight back', 'Back stays neutral, like a table top', 'Squeeze glutes to stand'],
    anim: { dur: 1400, poses: [
      { uL: -20, fL: -120 },
      { x: -12, y: 6, torso: 70, tL: -12, sL: 16, uL: -85, fL: -110 } ] }
  },
  arm_circles: {
    name: 'Arm circles', group: 'Warm-up', dose: '5 small forward, 5 backward', rest: 0,
    cues: ['Small, slow circles', 'Only the range that feels easy for the left shoulder'],
    anim: { dur: 700, poses: [
      { uL: -75, fL: 0, uR: -95 },
      { uL: -105, fL: 0, uR: -70 } ] }
  },

  /* ---------- WORKOUT A ---------- */
  chair_squat: {
    name: 'Chair squat', group: 'Workout A', sets: 3, reps: [10, 15], rest: 75,
    cues: ['Feet around shoulder width', 'Push hips backward, touch the chair lightly', 'Stand back up, knees tracking over toes', 'Do NOT fall onto the chair'],
    anim: { dur: 1400, props: ['chair-back'], poses: [
      { uL: -25, fL: -110 },
      { x: -30, y: 32, torso: 40, tL: -85, sL: 85, uL: -130, fL: -5 } ] }
  },
  wall_pushup: {
    name: 'Wall push-up', group: 'Workout A', sets: 3, reps: [6, 12], rest: 90, pushup: true,
    cues: ['Hands at chest / shoulder height', 'Body in one straight line', 'Elbows about 30–45° from the body, not flared', 'Lower slowly, push away smoothly', 'Both shoulders move evenly. STOP if the left shoulder gives sharp pain'],
    anim: { dur: 1500, props: ['wall-front'], poses: [
      { rot: 15, x: 3, y: 2, uL: -100, fL: 0 },
      { rot: 22, x: 11, y: 5, uL: -66, fL: -96 } ] }
  },
  rev_lunge: {
    name: 'Supported reverse lunge', group: 'Workout A', sets: 2, reps: [6, 10], rest: 75, perSide: true,
    cues: ['Hold a wall or chair if needed', 'Step back, lower the back knee toward the floor', 'Front shin stays fairly vertical', 'Too difficult? Do chair squats instead'],
    anim: { dur: 1500, props: ['wall:34'], poses: [
      { x: -20, uL: -25, fL: -110, uR: -100, fR: 0 },
      { x: -40, y: 23, torso: 10, tL: -70, sL: 70, tR: 45, sR: 5, uL: -35, fL: -110, uR: -105, fR: 0 } ] }
  },
  glute_bridge: {
    name: 'Glute bridge', group: 'Workout A', sets: 3, reps: [12, 15], rest: 60,
    cues: ['Lie on your back, knees bent, feet flat', 'Drive through the heels, lift the hips', 'Squeeze glutes hard for 1–2 s at the top', 'Do not arch the lower back, ribs stay down'],
    anim: { dur: 1400, floor: true, noFoot: true, poses: [
      { rot: -90, y: 62, tL: -45, sL: 135, uL: -12 },
      { rot: -90, y: 44, torso: -24, tL: -9, sL: 115, uL: -12 } ] }
  },
  prone_w: {
    name: 'Prone W', group: 'Workout A', sets: 2, reps: [8, 12], rest: 50,
    cues: ['Lie on your stomach, forehead down', 'Bend elbows so arms make a W shape', 'Gently squeeze shoulder blades back and DOWN, lift arms a little', 'Do NOT shrug the shoulders toward the ears'],
    anim: { dur: 1400, floor: true, noFoot: true, poses: [
      { rot: 90, y: 62, uL: 12, fL: -140 },
      { rot: 90, y: 62, uL: 48, fL: -150 } ] }
  },
  dead_bug: {
    name: 'Dead bug', group: 'Workout A', sets: 3, reps: [6, 10], rest: 50, perSide: true,
    cues: ['On your back, arms up, knees over hips', 'Lower the opposite arm and leg slowly', 'Lower back stays pressed into the floor', 'If the left shoulder dislikes overhead: keep arms pointing up and only move the legs'],
    anim: { dur: 1600, floor: true, noFoot: true, poses: [
      { rot: -90, y: 62, uL: -90, uR: -90, tL: -90, sL: 90, tR: -90, sR: 90 },
      { rot: -90, y: 62, uL: -172, uR: -90, tL: -90, sL: 90, tR: -15, sR: 5 } ] }
  },
  calf_raise: {
    name: 'Calf raise', group: 'Workout A', sets: 3, reps: [15, 20], rest: 45,
    cues: ['Fingertips on a wall for balance', 'Rise onto the balls of the feet, pause at the top', 'Lower slowly, full range'],
    anim: { dur: 1100, props: ['wall-near'], poses: [
      { uL: -95, fL: 0 },
      { y: -8, uL: -95, fL: 0 } ] }
  },
  plank: {
    name: 'Front plank', group: 'Workout A', sets: 2, reps: [15, 30], unit: 's', rest: 60,
    cues: ['Elbows under shoulders, forearms flat', 'Squeeze glutes, tuck the ribs', 'Do NOT let the lower back sag', 'From knees if a full plank is too hard'],
    anim: { dur: 2000, floor: true, poses: [
      { rot: 75, x: -7, y: 52, uL: -75, fL: -90 },
      { rot: 75, x: -7, y: 53, uL: -75, fL: -90 } ] }
  },

  /* ---------- WORKOUT B ---------- */
  slow_squat: {
    name: 'Slow bodyweight squat', group: 'Workout B', sets: 3, reps: [10, 15], rest: 75,
    cues: ['Tempo: 3 s down, 1 s pause at the bottom, stand normally', 'Chest up, weight through mid-foot', 'Knees track over the toes'],
    anim: { dur: 2200, poses: [
      { uL: -25, fL: -110 },
      { x: -30, y: 32, torso: 40, tL: -85, sL: 85, uL: -130, fL: -5 } ] }
  },
  good_morning: {
    name: 'Good morning / hip hinge', group: 'Workout B', sets: 3, reps: [12, 15], rest: 60,
    cues: ['Slight bend in the knees', 'Push hips backward, torso folds forward', 'Back neutral the whole time', 'Squeeze glutes when standing'],
    anim: { dur: 1600, poses: [
      { uL: -20, fL: -120 },
      { x: -12, y: 6, torso: 70, tL: -12, sL: 16, uL: -85, fL: -110 } ] }
  },
  split_squat: {
    name: 'Supported split squat', group: 'Workout B', sets: 2, reps: [6, 10], rest: 75, perSide: true,
    cues: ['Feet stay in a long stance, hold the wall if needed', 'Lower straight down, back knee toward the floor', 'Front knee over the mid-foot', 'Push through the front heel to stand'],
    anim: { dur: 1400, props: ['wall:38'], poses: [
      { x: -20, y: 8, torso: 5, tL: -35, sL: 35, tR: 25, sR: 10, uL: -35, fL: -110, uR: -105, fR: 0 },
      { x: -33, y: 23, torso: 10, tL: -70, sL: 70, tR: 45, sR: 5, uL: -35, fL: -110, uR: -105, fR: 0 } ] }
  },
  snow_angel: {
    name: 'Reverse snow angel', group: 'Workout B', sets: 2, reps: [8, 12], rest: 50,
    cues: ['Lie face-down, arms at your sides, thumbs up', 'Lift arms slightly and sweep them slowly overhead', 'Only through a comfortable range', 'Do NOT force the left shoulder overhead'],
    anim: { dur: 2200, floor: true, noFoot: true, poses: [
      { rot: 90, y: 62, uL: 15, fL: 0 },
      { rot: 90, y: 62, uL: 165, fL: 0 } ] }
  },
  bird_dog: {
    name: 'Bird dog', group: 'Workout B', sets: 3, reps: [6, 10], rest: 50, perSide: true,
    cues: ['Hands under shoulders, knees under hips', 'Extend opposite arm and leg slowly', 'Do not rotate the hips, do not arch the back', 'Pause 1 s, return with control'],
    anim: { dur: 1800, floor: true, noFoot: true, poses: [
      { rot: 90, x: -20, y: 37, torso: -12, uL: -70, fL: -40, uR: -70, fR: -40, tL: -90, sL: 90, tR: -90, sR: 90 },
      { rot: 90, x: -20, y: 37, torso: -12, uL: -70, fL: -40, uR: -170, fR: 0, tL: 0, sL: 0, tR: -90, sR: 90 } ] }
  },
  wall_sit: {
    name: 'Wall sit', group: 'Workout B', sets: 2, reps: [20, 45], unit: 's', rest: 60,
    cues: ['Back flat against the wall', 'Thighs parallel to the floor, knees at 90°', 'Weight in the heels, breathe'],
    anim: { dur: 2000, props: ['wall-back'], poses: [
      { y: 35, tL: -90, sL: 90, uL: -10, fL: -80 },
      { y: 36, tL: -90, sL: 90, uL: -10, fL: -80 } ] }
  },
  side_plank: {
    name: 'Side plank from knees', group: 'Workout B', sets: 2, reps: [15, 30], unit: 's', rest: 45, perSide: true,
    cues: ['Elbow under the shoulder, knees bent', 'Lift the hips, body in a straight line from head to knees', 'If the shoulder position hurts: skip it and do another front plank'],
    anim: { dur: 2000, floor: true, noFoot: true, poses: [
      { rot: 70, x: -22, y: 58, uL: -70, fL: -90, sL: 20 },
      { rot: 70, x: -22, y: 59, uL: -70, fL: -90, sL: 20 } ] }
  },

  /* ---------- SHOULDER ROUTINE ---------- */
  sh_pendulum: {
    name: 'Pendulum', group: 'Shoulder', sets: 2, reps: [10, 10], unit: 'circles', rest: 0,
    cues: ['Lean forward, other hand on a chair', 'Arm hangs completely relaxed', '10 circles each direction, let it swing'],
    anim: { dur: 900, props: ['chair-front'], poses: [
      { torso: 45, x: -10, tL: -10, sL: 15, uR: -115, fR: -10, uL: -30, fL: 0 },
      { torso: 45, x: -10, tL: -10, sL: 15, uR: -115, fR: -10, uL: -65, fL: 0 } ] }
  },
  sh_squeeze: {
    name: 'Scapular squeeze', group: 'Shoulder', sets: 2, reps: [12, 15], rest: 30,
    cues: ['Squeeze shoulder blades back and down', 'Hold 2 seconds each rep', 'No shrugging'],
    anim: { dur: 1400, poses: [
      { uL: 0, fL: -90, torso: 2 },
      { uL: 22, fL: -95, torso: -4 } ] }
  },
  sh_er_iso: {
    name: 'External rotation wall isometric', group: 'Shoulder', sets: 3, reps: [15, 20], unit: 's', rest: 30, perSide: true,
    cues: ['Elbow bent 90°, elbow pressed against the ribs', 'Back of the hand presses gently outward into the wall', 'The arm should NOT actually move', 'Moderate force, not maximum. Breathe'],
    anim: { dur: 1200, props: ['wall-side'], poses: [
      { uL: 0, fL: -90 },
      { uL: 0, fL: -92, torso: -2 } ] }
  },
  sh_wall_slide: {
    name: 'Wall slide', group: 'Shoulder', sets: 2, reps: [8, 10], rest: 30,
    cues: ['Back against the wall, arms in a goal-post', 'Slide up only as high as feels comfortable', 'Ribs down, no arching'],
    anim: { dur: 1600, props: ['wall-back'], poses: [
      { uL: -100, fL: -80 },
      { uL: -165, fL: -15 } ] }
  },
  sh_cross: {
    name: 'Cross-body shoulder stretch', group: 'Shoulder', sets: 2, reps: [20, 30], unit: 's', rest: 0, perSide: true,
    cues: ['Bring one arm across the chest', 'Hook it gently with the other arm', 'Gentle stretch only, never yank it'],
    anim: { dur: 2000, poses: [
      { uL: -88, fL: -10, uR: -55, fR: -105 },
      { uL: -92, fL: -12, uR: -55, fR: -108 } ] }
  },

  /* ---------- CARDIO ---------- */
  c_brisk: {
    name: 'Brisk march', group: 'Cardio', dose: '2 minutes', rest: 0,
    cues: ['Pump the arms, drive the knees', 'Breathing harder but can still speak a short sentence'],
    anim: { dur: 420, poses: [
      { tL: -65, sL: 75, tR: 8, sR: 5, uL: 35, fL: -40, uR: -45, fR: -70 },
      { tL: 8, sL: 5, tR: -65, sR: 75, uL: -45, fL: -70, uR: 35, fR: -40 } ] }
  },
  c_side: {
    name: 'Side steps', group: 'Cardio', dose: '1 minute', rest: 0,
    cues: ['Step out to the side, bring the other foot to meet it', 'Swap direction every few steps', 'Soft knees, no jumping'],
    anim: { dur: 500, poses: [
      { x: -18, tL: -25, sL: 25, tR: 25, sR: 10, uL: -40, fL: -30 },
      { x: 18, tL: 25, sL: 10, tR: -25, sR: 25, uL: -40, fL: -30 } ] }
  },
  c_knee: {
    name: 'Knee raises', group: 'Cardio', dose: '1 minute', rest: 0,
    cues: ['Lift each knee to hip height', 'Tall torso, tap the knee with the opposite hand'],
    anim: { dur: 520, poses: [
      { tL: -95, sL: 95, tR: 5, sR: 5, uL: 10, fL: -20, uR: -80, fR: -30 },
      { tL: 5, sL: 5, tR: -95, sR: 95, uL: -80, fL: -30, uR: 10, fR: -20 } ] }
  },
  c_easy: {
    name: 'Easy march', group: 'Cardio', dose: '1 minute', rest: 0,
    cues: ['Recovery pace, shake out the arms', 'Catch your breath'],
    anim: { dur: 800, poses: [
      { tL: -40, sL: 45, tR: 5, sR: 5, uL: 20, fL: -20, uR: -25, fR: -30 },
      { tL: 5, sL: 5, tR: -40, sR: 45, uL: -25, fL: -30, uR: 20, fR: -20 } ] }
  },

  /* ---------- PUSH-UP PROGRESSION (levels 2-5) ---------- */
  counter_pushup: {
    name: 'Counter push-up', group: 'Progression', sets: 3, reps: [6, 12], rest: 90, pushup: true,
    cues: ['Hands on a high kitchen counter', 'Body straight, elbows 30–45° from the body', 'Same rules as the wall push-up'],
    anim: { dur: 1500, props: ['counter'], poses: [
      { rot: 40, x: 0, y: 16, uL: -100, fL: 0 },
      { rot: 50, x: 9, y: 25, uL: -72, fL: -96 } ] }
  },
  low_counter_pushup: {
    name: 'Low counter / table push-up', group: 'Progression', sets: 3, reps: [6, 12], rest: 90, pushup: true,
    cues: ['Hands on a sturdy table or low counter', 'Body straight from head to heels', 'Only progress here when the counter version is pain-free'],
    anim: { dur: 1500, props: ['table'], poses: [
      { rot: 55, x: 12, y: 30, uL: -110, fL: 0 },
      { rot: 63, x: 18, y: 38, uL: -85, fL: -85 } ] }
  },
  knee_pushup: {
    name: 'Knee push-up', group: 'Progression', sets: 3, reps: [6, 12], rest: 90, pushup: true,
    cues: ['Knees on the floor, body straight from knees to head', 'Hands slightly wider than shoulders', 'Chest to just above the floor, no sagging hips'],
    anim: { dur: 1500, floor: true, noFoot: true, poses: [
      { rot: 50, x: -33, y: 47, uL: -77, fL: 0, sL: 40 },
      { rot: 62, x: -29, y: 54, uL: -43, fL: -89, sL: 28 } ] }
  },
  full_pushup: {
    name: 'Full push-up', group: 'Progression', sets: 3, reps: [6, 12], rest: 90, pushup: true,
    cues: ['Month 2+ goal. Do NOT skip levels because of ego', 'Body in one line, elbows 30–45°', 'Chest to just above the floor'],
    anim: { dur: 1500, floor: true, poses: [
      { rot: 75, x: -12, y: 52, uL: -133, fL: 0 },
      { rot: 84, x: -10, y: 63, uL: -125, fL: -70 } ] }
  }
};

const PUSHUP_LEVELS = [
  { id: 'wall_pushup', label: 'Level 1 · Wall' },
  { id: 'counter_pushup', label: 'Level 2 · High counter' },
  { id: 'low_counter_pushup', label: 'Level 3 · Low counter / table' },
  { id: 'knee_pushup', label: 'Level 4 · Knee' },
  { id: 'full_pushup', label: 'Level 5 · Full' }
];

const PLAN = {
  weeks: 4,
  warmup: ['march', 'pendulum', 'scap_squeeze', 'wall_slide', 'squat_bw', 'hinge', 'arm_circles'],
  A: ['chair_squat', 'wall_pushup', 'rev_lunge', 'glute_bridge', 'prone_w', 'dead_bug', 'calf_raise', 'plank'],
  B: ['slow_squat', 'wall_pushup', 'good_morning', 'split_squat', 'snow_angel', 'bird_dog', 'wall_sit', 'side_plank'],
  shoulder: ['sh_pendulum', 'sh_squeeze', 'sh_er_iso', 'sh_wall_slide', 'sh_cross'],
  cardioCircuit: [
    { id: 'c_brisk', sec: 120 }, { id: 'c_side', sec: 60 }, { id: 'c_knee', sec: 60 }, { id: 'c_easy', sec: 60 }
  ],
  /* weekday: 1 Mon .. 6 Sat, 0 Sun */
  dayTypes: {
    1: 'strength', 2: 'cardio', 3: 'strength', 4: 'cardio', 5: 'strength', 6: 'easy', 0: 'rest'
  },
  cardioMinutes: { 2: 30, 4: 30, 6: 40 },
  /* which workout on the strength days: week 1/3 = A B A, week 2/4 = B A B */
  strengthPattern: { odd: { 1: 'A', 3: 'B', 5: 'A' }, even: { 1: 'B', 3: 'A', 5: 'B' } },
  /* progression: fraction of the rep range to aim for */
  weekFraction: [0, 0.35, 0.7, 1],
  weekNotes: [
    'Learn technique. Use the LOWER end of every rep range. Leave about 3 reps in reserve. Do NOT chase soreness.',
    'Add roughly 1–2 reps per set compared with week 1. Keep every rep clean.',
    'Reach the upper half of the rep ranges. Slow the reps down: 3 s on the way down.',
    'Try to reach the TOP of each rep range. Still 2 reps in reserve, still no failure.'
  ],
  goals: [
    '15 clean bodyweight squats', '10–15 pain-free wall / incline push-ups', '10 controlled split squats per leg',
    '15 good glute bridges', '30–45 second plank', '30+ minutes continuous moderate cardio',
    'Better control of the left shoulder', 'Smaller waist measurement', 'Improved stamina'
  ],
  rules: [
    'Never train through sharp shoulder pain. Burning = ok. Sharp pain, instability, numbness, catching = STOP.',
    'Finish most sets thinking "I could do 2–3 more clean reps".',
    'If form breaks, the set is over. Bad reps do not count.',
    'No 100 push-ups a day. No 500 squat challenges. No starving. No daily max-effort.',
    'Consistency > intensity. Only be better on Day 30 than on Day 1.'
  ],
  notYet: ['Dips', 'Pull-ups', 'Handstands', 'Pike push-ups', 'Explosive push-ups', 'Burpees', 'Deep floor push-ups', 'Long dead hangs', 'Training to failure'],
  progressions: {
    'Push-up': ['Wall push-up', 'High counter push-up', 'Low counter / table push-up', 'Knee push-up', 'Full push-up'],
    'Squat': ['Chair squat', 'Normal squat', 'Slow squat', 'Pause squat', 'Split squat', 'Reverse lunge'],
    'Core': ['Dead bug', 'Longer dead bug', 'Plank', 'Longer plank', 'Harder plank variations']
  },
  nutrition: [
    ['Calories', '≈1,700 kcal / day'], ['Protein', '130–140 g / day'], ['Oil', '3 tsp / day, measured'],
    ['Steps', '8,000–10,000 / day'], ['Sleep', '7–9 h'], ['Water', '2.5–3 L']
  ]
};
