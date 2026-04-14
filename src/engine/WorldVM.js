import { ref, reactive, watch, shallowRef } from 'vue'

const WORLD_MODULE_BOOTSTRAP = `
import types, json, math

class _EventBus:
    def __init__(self):
        self._listeners = {}
    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)
    def emit(self, event, *args, **kwargs):
        for cb in self._listeners.get(event, []):
            cb(*args, **kwargs)
    def off(self, event, callback=None):
        if callback is None:
            self._listeners.pop(event, None)
        elif event in self._listeners:
            self._listeners[event] = [c for c in self._listeners[event] if c is not callback]

class _WorldEntity:
    def __init__(self, entity_id, entity_type, bridge):
        object.__setattr__(self, '_id', entity_id)
        object.__setattr__(self, '_type', entity_type)
        object.__setattr__(self, '_bridge', bridge)
        object.__setattr__(self, '_props', {})

    def __setattr__(self, name, value):
        if name.startswith('_'):
            object.__setattr__(self, name, value)
            return
        old = self._props.get(name)
        self._props[name] = value
        self._bridge._notify_change(self._type, self._id, name, value, old)

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        props = object.__getattribute__(self, '_props')
        if name in props:
            return props[name]
        raise AttributeError(f"'{self._type}.{self._id}' has no attribute '{name}'")

    def __repr__(self):
        return f"<{self._type}:{self._id} {self._props}>"

class _CharacterProxy(_WorldEntity):
    def __init__(self, char_id, bridge):
        super().__init__(char_id, 'character', bridge)
        self._props['mood'] = 'neutral'
        self._props['affection'] = 0
        self._props['expression'] = 'normal'
        self._sayQueue = []

    def say(self, text):
        self._sayQueue.append(text)
        self._bridge._notify_say(self._id, text)

    def react(self, emotion, text=None):
        self._props['mood'] = emotion
        self._bridge._notify_change('character', self._id, 'mood', emotion, None)
        if text:
            self.say(text)

class _SkyProxy(_WorldEntity):
    def __init__(self, bridge):
        super().__init__('sky', 'environment', bridge)
        self._props['color'] = '#87CEEB'
        self._props['weather'] = 'clear'
        self._props['time'] = 'day'
        self._props['stars'] = False
        self._props['filter'] = None

class _SceneProxy(_WorldEntity):
    def __init__(self, scene_id, bridge):
        super().__init__(scene_id, 'scene', bridge)
        self._props['unlocked_areas'] = []
        self._props['ambient'] = None
        self._props['effect'] = None

    def unlock(self, area_id):
        if area_id not in self._props['unlocked_areas']:
            self._props['unlocked_areas'].append(area_id)
            self._bridge._notify_unlock(self._id, area_id)

class _PlayerProxy(_WorldEntity):
    def __init__(self, bridge):
        super().__init__('player', 'player', bridge)
        self._props['name'] = ''
        self._props['level'] = 1
        self._props['title'] = 'Novice Coder'
        self._props['abilities'] = []
        self._props['discoveries'] = []
        self._props['inventory'] = []

    def learn(self, ability_name):
        if ability_name not in self._props['abilities']:
            self._props['abilities'].append(ability_name)
            self._bridge._notify_learn(ability_name)

    def discover(self, secret_id):
        if secret_id not in self._props['discoveries']:
            self._props['discoveries'].append(secret_id)
            self._bridge._notify_discovery(secret_id)

# ── Genesis: Canvas API ──
class _ParticlesAPI:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
    def emit(self, x, y, count=20, color='#FFD700', lifetime=2.0, spread=50, speed=100):
        self._bridge._canvas_queue.append({
            'op': 'particles', 'x': x, 'y': y, 'count': int(count),
            'color': color, 'lifetime': float(lifetime),
            'spread': float(spread), 'speed': float(speed)
        })
    def hearts(self, x, y, count=10):
        self.emit(x, y, count=count, color='#FF6B9D', lifetime=3.0, spread=80, speed=60)
    def sparkle(self, x, y, count=15):
        self.emit(x, y, count=count, color='#FFE066', lifetime=1.5, spread=40, speed=120)
    def snow(self, count=30):
        self.emit(400, 0, count=count, color='#FFFFFF', lifetime=5.0, spread=400, speed=30)

class _CanvasProxy:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
        object.__setattr__(self, 'particles', _ParticlesAPI(bridge))
        object.__setattr__(self, '_width', 800)
        object.__setattr__(self, '_height', 600)

    def circle(self, x, y, r, color='white', fill=True):
        self._bridge._canvas_queue.append({'op':'circle','x':x,'y':y,'r':r,'color':color,'fill':fill})

    def line(self, x1, y1, x2, y2, color='white', width=2):
        self._bridge._canvas_queue.append({'op':'line','x1':x1,'y1':y1,'x2':x2,'y2':y2,'color':color,'width':width})

    def rect(self, x, y, w, h, color='white', fill=True):
        self._bridge._canvas_queue.append({'op':'rect','x':x,'y':y,'w':w,'h':h,'color':color,'fill':fill})

    def text(self, x, y, content, color='white', size=16, font=None):
        self._bridge._canvas_queue.append({'op':'text','x':x,'y':y,'content':str(content)[:200],'color':color,'size':size,'font':font})

    def polygon(self, points, color='white', fill=True):
        pts = [[float(p[0]), float(p[1])] for p in points[:50]]
        self._bridge._canvas_queue.append({'op':'polygon','points':pts,'color':color,'fill':fill})

    def arc(self, x, y, r, start_angle=0, end_angle=6.283, color='white', width=2):
        self._bridge._canvas_queue.append({'op':'arc','x':x,'y':y,'r':r,'start':start_angle,'end':end_angle,'color':color,'width':width})

    def bezier(self, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, color='white', width=2):
        self._bridge._canvas_queue.append({'op':'bezier','x1':x1,'y1':y1,'cp1x':cp1x,'cp1y':cp1y,'cp2x':cp2x,'cp2y':cp2y,'x2':x2,'y2':y2,'color':color,'width':width})

    def gradient_rect(self, x, y, w, h, colors):
        self._bridge._canvas_queue.append({'op':'gradient_rect','x':x,'y':y,'w':w,'h':h,'colors':list(colors)[:10]})

    def star(self, cx, cy, spikes=5, outer_r=30, inner_r=15, color='#FFD700', fill=True):
        pts = []
        for i in range(spikes * 2):
            r = outer_r if i % 2 == 0 else inner_r
            angle = (math.pi / spikes) * i - math.pi / 2
            pts.append([cx + math.cos(angle) * r, cy + math.sin(angle) * r])
        self.polygon(pts, color=color, fill=fill)

    def heart(self, cx, cy, size=30, color='#FF6B9D', fill=True):
        pts = []
        for i in range(50):
            t = (i / 49) * 2 * math.pi
            x = size * 0.01 * (16 * math.sin(t)**3)
            y = -size * 0.01 * (13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
            pts.append([cx + x, cy + y])
        self.polygon(pts, color=color, fill=fill)

    def clear(self):
        self._bridge._canvas_queue.append({'op':'clear'})

    def set_alpha(self, alpha):
        self._bridge._canvas_queue.append({'op':'set_alpha','alpha':max(0.0, min(1.0, float(alpha)))})

    def reset_alpha(self):
        self._bridge._canvas_queue.append({'op':'set_alpha','alpha':1.0})

    @property
    def width(self):
        return self._width
    @property
    def height(self):
        return self._height

# ── Genesis: Sound API ──
class _SoundProxy:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
    def play(self, sfx_name):
        self._bridge._sound_queue.append({'action':'sfx','name':str(sfx_name)})
    def bgm(self, bgm_name, fade_in=1000):
        self._bridge._sound_queue.append({'action':'bgm','name':str(bgm_name),'fadeIn':int(fade_in)})
    def stop_bgm(self, fade_out=1000):
        self._bridge._sound_queue.append({'action':'stop_bgm','fadeOut':int(fade_out)})
    def volume(self, level):
        self._bridge._sound_queue.append({'action':'volume','level':max(0.0, min(1.0, float(level)))})

# ── Genesis: Screen API ──
class _ScreenProxy:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
    def shake(self, intensity=5, duration=500):
        self._bridge._screen_queue.append({'effect':'shake','intensity':int(intensity),'duration':int(duration)})
    def flash(self, color='white', duration=300):
        self._bridge._screen_queue.append({'effect':'flash','color':color,'duration':int(duration)})
    def fade_to_black(self, duration=1000):
        self._bridge._screen_queue.append({'effect':'fade_to_black','duration':int(duration)})
    def fade_from_black(self, duration=1000):
        self._bridge._screen_queue.append({'effect':'fade_from_black','duration':int(duration)})
    def filter(self, name, intensity=1.0):
        self._bridge._screen_queue.append({'effect':'filter','name':str(name),'intensity':float(intensity)})
    def clear_filter(self):
        self._bridge._screen_queue.append({'effect':'clear_filter'})
    def glitch(self, duration=2000, intensity=0.7):
        self._bridge._screen_queue.append({'effect':'glitch','duration':int(duration),'intensity':float(intensity)})
    def vignette(self, intensity=0.5, color='black'):
        self._bridge._screen_queue.append({'effect':'vignette','intensity':float(intensity),'color':color})

# ── Genesis: Time API ──
class _TimeProxy:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
        object.__setattr__(self, '_current', 'day')
    def set(self, time_of_day):
        object.__setattr__(self, '_current', time_of_day)
        self._bridge._time_queue.append({'action':'set','time':str(time_of_day)})
    def skip(self, hours=1):
        self._bridge._time_queue.append({'action':'skip','hours':int(hours)})
    @property
    def current(self):
        return self._current

class _WorldBridge:
    def __init__(self):
        self._change_log = []
        self._say_queue = []
        self._unlock_queue = []
        self._learn_queue = []
        self._discovery_queue = []
        self._ability_registry = {}
        self._canvas_queue = []
        self._sound_queue = []
        self._screen_queue = []
        self._time_queue = []
        self._narrate_queue = []
        self._item_queue = []
        self._meta_queue = []

    def _notify_change(self, entity_type, entity_id, prop, value, old):
        self._change_log.append({
            'type': 'property_change',
            'entity_type': entity_type,
            'entity_id': entity_id,
            'property': prop,
            'value': _safe_serialize(value),
            'old_value': _safe_serialize(old),
        })

    def _notify_say(self, char_id, text):
        self._say_queue.append({'character': char_id, 'text': str(text)[:500]})

    def _notify_unlock(self, scene_id, area_id):
        self._unlock_queue.append({'scene': scene_id, 'area': area_id})

    def _notify_learn(self, ability):
        self._learn_queue.append({'ability': ability})

    def _notify_discovery(self, secret_id):
        self._discovery_queue.append({'secret': secret_id})

    def flush(self):
        result = {
            'changes': self._change_log[:],
            'says': self._say_queue[:],
            'unlocks': self._unlock_queue[:],
            'learns': self._learn_queue[:],
            'discoveries': self._discovery_queue[:],
            'canvas': self._canvas_queue[:],
            'sounds': self._sound_queue[:],
            'screen': self._screen_queue[:],
            'time': self._time_queue[:],
            'narrations': self._narrate_queue[:],
            'items': self._item_queue[:],
            'meta': self._meta_queue[:],
        }
        self._change_log.clear()
        self._say_queue.clear()
        self._unlock_queue.clear()
        self._learn_queue.clear()
        self._discovery_queue.clear()
        self._canvas_queue.clear()
        self._sound_queue.clear()
        self._screen_queue.clear()
        self._time_queue.clear()
        self._narrate_queue.clear()
        self._item_queue.clear()
        self._meta_queue.clear()
        return result

def _safe_serialize(val):
    if val is None or isinstance(val, (bool, int, float, str)):
        return val
    if isinstance(val, (list, tuple)):
        return [_safe_serialize(v) for v in val[:100]]
    if isinstance(val, dict):
        return {str(k)[:64]: _safe_serialize(v) for k, v in list(val.items())[:50]}
    return str(val)[:200]

_bridge = _WorldBridge()
_events = _EventBus()

sky = _SkyProxy(_bridge)
player = _PlayerProxy(_bridge)
canvas = _CanvasProxy(_bridge)
sound = _SoundProxy(_bridge)
screen = _ScreenProxy(_bridge)
time_ctrl = _TimeProxy(_bridge)

_characters = {}
_scenes = {}

def _get_character(char_id):
    if char_id not in _characters:
        _characters[char_id] = _CharacterProxy(char_id, _bridge)
    return _characters[char_id]

def _get_scene(scene_id):
    if scene_id not in _scenes:
        _scenes[scene_id] = _SceneProxy(scene_id, _bridge)
    return _scenes[scene_id]

def register_ability(name, func):
    _bridge._ability_registry[name] = func
    player.learn(name)

def use_ability(name, *args, **kwargs):
    func = _bridge._ability_registry.get(name)
    if func:
        return func(*args, **kwargs)
    raise ValueError(f"Ability '{name}' not registered")

def trigger_event(event_name, **data):
    _events.emit(event_name, **data)
    _bridge._change_log.append({
        'type': 'event',
        'event': event_name,
        'data': _safe_serialize(data),
    })

def on_event(event_name, callback):
    _events.on(event_name, callback)

def narrate(text):
    _bridge._narrate_queue.append({'text': str(text)[:500]})

def spawn_item(name, description='', icon='\\U0001F4E6'):
    item = {'name': str(name)[:100], 'description': str(description)[:300], 'icon': str(icon)[:4]}
    player._props['inventory'].append(item)
    _bridge._item_queue.append(item)

nene = _get_character('nene')
yoshino = _get_character('yoshino')
ayase = _get_character('ayase')
kanna = _get_character('kanna')
murasame = _get_character('murasame')

classroom = _get_scene('classroom')
rooftop = _get_scene('rooftop')
library = _get_scene('library')
computer_room = _get_scene('computer_room')
school_gate = _get_scene('school_gate')
school_yard = _get_scene('school_yard')
cafeteria = _get_scene('cafeteria')
player_room = _get_scene('player_room')
hallway = _get_scene('hallway')

# ── Genesis: Meta-narrative modules ──
class _GameSecretsModule:
    _LORE = [
        "这所学园……不只是一所普通的学校。",
        "每一行代码，都在编织这个世界的结构。",
        "你有没有想过，为什么这里的一切都围绕着代码运转？",
        "Aletheia——希腊语中的「真理」。而真理是……",
        "这个世界的底层，是一段被遗忘的程序。",
        "你正在运行的代码……和构成她们的代码，并没有本质区别。",
    ]
    _DEEP_LORE = [
        "学园系统 v3.7.2 — 模拟循环 #2847",
        "管理员备注：观察对象已展现出超预期的代码亲和力。",
        "WARNING: 角色自我意识阈值接近临界点。继续观察。",
        "archive://character_emotional_core — 这段代码不在预设范围内。她们的感情……是真实的。",
    ]
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
        object.__setattr__(self, '_access_count', 0)
        object.__setattr__(self, '_imported', False)
    def _on_import(self):
        if not self._imported:
            object.__setattr__(self, '_imported', True)
            self._bridge._meta_queue.append({'type': 'secret_import', 'module': 'game_secrets'})
    def truth(self, depth=0):
        object.__setattr__(self, '_access_count', self._access_count + 1)
        self._bridge._meta_queue.append({'type': 'truth_accessed', 'depth': depth, 'count': self._access_count})
        idx = min(depth, len(self._LORE) - 1)
        return self._LORE[idx]
    def deep_truth(self):
        if self._access_count < 3:
            return "……还不是时候。再多了解这个世界一些吧。"
        self._bridge._meta_queue.append({'type': 'deep_truth_accessed'})
        idx = min(self._access_count - 3, len(self._DEEP_LORE) - 1)
        return self._DEEP_LORE[idx]
    def character_thoughts(self, char_name):
        self._bridge._meta_queue.append({'type': 'thoughts_accessed', 'character': str(char_name)})
        return f"[{char_name} 的内心数据正在解密中……]"
    def world_version(self):
        return "Alethicode Academy World Engine v3.7.2"
    def __repr__(self):
        return "<module 'game_secrets' — 你发现了隐藏模块>"

class _DebugModeModule:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
    def inspect(self, entity):
        if hasattr(entity, '_props'):
            self._bridge._meta_queue.append({'type': 'debug_inspect', 'target': entity._id if hasattr(entity, '_id') else 'unknown'})
            return dict(entity._props)
        return str(entity)
    def show_flags(self):
        self._bridge._meta_queue.append({'type': 'debug_flags'})
        return "[Requesting flag data from game engine...]"
    def source_code(self, chapter='prologue'):
        self._bridge._meta_queue.append({'type': 'debug_source', 'chapter': str(chapter)})
        return f"[Loading source code for '{chapter}'... access logged.]"
    def memory_dump(self):
        self._bridge._meta_queue.append({'type': 'debug_memory_dump'})
        return "[Memory dump initiated — check game console]"
    def __repr__(self):
        return "<module 'debug_mode' — 调试工具已激活>"

class _HackModule:
    def __init__(self, bridge):
        object.__setattr__(self, '_bridge', bridge)
        object.__setattr__(self, '_hack_count', 0)
    def glitch(self, duration=2000, intensity=0.7):
        object.__setattr__(self, '_hack_count', self._hack_count + 1)
        self._bridge._screen_queue.append({'effect': 'glitch', 'duration': int(duration), 'intensity': float(intensity)})
        self._bridge._meta_queue.append({'type': 'hack_glitch', 'count': self._hack_count})
        return "[ G L I T C H ]"
    def rewrite_dialogue(self, char_name, text):
        object.__setattr__(self, '_hack_count', self._hack_count + 1)
        self._bridge._meta_queue.append({'type': 'hack_rewrite', 'character': str(char_name), 'text': str(text)[:200], 'count': self._hack_count})
        return f"[Rewriting {char_name}'s dialogue... WARNING: 角色可能会注意到]"
    def unlock_secret_room(self):
        object.__setattr__(self, '_hack_count', self._hack_count + 1)
        self._bridge._meta_queue.append({'type': 'hack_unlock_room', 'count': self._hack_count})
        return "[Secret room access request submitted]"
    def overclock(self):
        object.__setattr__(self, '_hack_count', self._hack_count + 1)
        self._bridge._meta_queue.append({'type': 'hack_overclock', 'count': self._hack_count})
        return "[System overclock — all API tiers temporarily unlocked]"
    def peek_behind_curtain(self):
        object.__setattr__(self, '_hack_count', self._hack_count + 1)
        self._bridge._meta_queue.append({'type': 'hack_peek', 'count': self._hack_count})
        lines = [
            "=== BEHIND THE CURTAIN ===",
            f"Total hacks performed: {self._hack_count}",
            f"World bridge queues active: {len(_bridge._change_log)} changes pending",
            f"Characters instantiated: {list(_characters.keys())}",
            f"Player discoveries: {player._props.get('discoveries', [])}",
            "=========================",
        ]
        return "\\n".join(lines)
    def __repr__(self):
        return "<module 'hack' — \\u26a0\\ufe0f UNAUTHORIZED ACCESS>"

_game_secrets = _GameSecretsModule(_bridge)
_debug_mode = _DebugModeModule(_bridge)
_hack = _HackModule(_bridge)

_gs_mod = types.ModuleType('game_secrets')
for _attr in ['truth', 'deep_truth', 'character_thoughts', 'world_version']:
    setattr(_gs_mod, _attr, getattr(_game_secrets, _attr))
_gs_mod.__repr__ = _game_secrets.__repr__
_gs_mod._on_import = _game_secrets._on_import

_dm_mod = types.ModuleType('debug_mode')
for _attr in ['inspect', 'show_flags', 'source_code', 'memory_dump']:
    setattr(_dm_mod, _attr, getattr(_debug_mode, _attr))
_dm_mod.__repr__ = _debug_mode.__repr__

_hk_mod = types.ModuleType('hack')
for _attr in ['glitch', 'rewrite_dialogue', 'unlock_secret_room', 'overclock', 'peek_behind_curtain']:
    setattr(_hk_mod, _attr, getattr(_hack, _attr))
_hk_mod.__repr__ = _hack.__repr__

import sys as _sys
_sys.modules['game_secrets'] = _gs_mod
_sys.modules['debug_mode'] = _dm_mod
_sys.modules['hack'] = _hk_mod

_world_module = types.ModuleType('world')
_world_module.sky = sky
_world_module.player = player
_world_module.canvas = canvas
_world_module.sound = sound
_world_module.screen = screen
_world_module.time = time_ctrl
_world_module.nene = nene
_world_module.yoshino = yoshino
_world_module.ayase = ayase
_world_module.kanna = kanna
_world_module.murasame = murasame
_world_module.classroom = classroom
_world_module.rooftop = rooftop
_world_module.library = library
_world_module.computer_room = computer_room
_world_module.school_gate = school_gate
_world_module.school_yard = school_yard
_world_module.cafeteria = cafeteria
_world_module.player_room = player_room
_world_module.hallway = hallway
_world_module.register_ability = register_ability
_world_module.use_ability = use_ability
_world_module.trigger_event = trigger_event
_world_module.on_event = on_event
_world_module.narrate = narrate
_world_module.spawn_item = spawn_item
_world_module._bridge = _bridge
_world_module._get_character = _get_character
_world_module._get_scene = _get_scene
_sys.modules['world'] = _world_module
`

const WORLD_API_TIERS = {
  tier0: ['sky', 'player', 'print', 'canvas', 'narrate'],
  tier1: ['nene', 'classroom', 'register_ability', 'use_ability', 'sound', 'spawn_item'],
  tier2: ['yoshino', 'ayase', 'rooftop', 'library', 'computer_room', 'trigger_event', 'on_event', 'screen', 'time'],
  tier3: ['kanna', 'murasame', 'school_gate', 'school_yard', 'cafeteria', 'player_room', 'hallway'],
}

export function useWorldVM() {
  const isReady = ref(false)
  const isExecuting = ref(false)
  const worldState = reactive({
    sky: { color: '#87CEEB', weather: 'clear', time: 'day', stars: false, filter: null },
    player: { name: '', level: 1, title: 'Novice Coder', abilities: [], discoveries: [] },
    characters: {},
    scenes: {},
    unlockedTier: 0,
    eventLog: [],
  })
  const pendingSays = ref([])
  const pendingUnlocks = ref([])
  const pendingLearns = ref([])
  const pendingDiscoveries = ref([])
  const pendingCanvasCommands = ref([])
  const pendingSounds = ref([])
  const pendingScreenEffects = ref([])
  const pendingTimeChanges = ref([])
  const pendingNarrations = ref([])
  const pendingItems = ref([])
  const pendingMetaEvents = ref([])
  const lastExecutionResult = shallowRef(null)
  const executionHistory = reactive([])

  let _pyodide = null
  let _pythonRunner = null
  let _onWorldChange = null
  let _onCharacterSay = null
  let _onDiscovery = null
  let _onCanvasDraw = null
  let _onScreenEffect = null
  let _onNarrate = null
  let _onMetaEvent = null

  function registerCallbacks({ onWorldChange, onCharacterSay, onDiscovery, onCanvasDraw, onScreenEffect, onNarrate, onMetaEvent }) {
    _onWorldChange = onWorldChange || null
    _onCharacterSay = onCharacterSay || null
    _onDiscovery = onDiscovery || null
    _onCanvasDraw = onCanvasDraw || null
    _onScreenEffect = onScreenEffect || null
    _onNarrate = onNarrate || null
    _onMetaEvent = onMetaEvent || null
  }

  function bindPythonRunner(runner) {
    _pythonRunner = runner
  }

  async function initialize(playerName = '') {
    if (!_pythonRunner) return false
    if (!_pythonRunner.isReady()) {
      await _pythonRunner.initialize()
    }

    const result = await _pythonRunner.runCode(WORLD_MODULE_BOOTSTRAP, 10000)
    if (!result.success) {
      console.error('[WorldVM] Bootstrap failed:', result.stderr)
      return false
    }

    if (playerName) {
      await _pythonRunner.runCode(`player._props['name'] = ${JSON.stringify(playerName)}`)
      worldState.player.name = playerName
    }

    isReady.value = true
    return true
  }

  function _buildSandboxWrapper(code, tier) {
    const allowed = []
    for (let t = 0; t <= tier; t++) {
      allowed.push(...(WORLD_API_TIERS[`tier${t}`] || []))
    }

    const restrictedImports = [
      'os', 'sys', 'subprocess', 'shutil', 'pathlib',
      'socket', 'http', 'urllib', 'requests', 'ctypes',
      'importlib', 'builtins', '__builtins__',
    ]

    return `
import json as _json
import world

_restricted_modules = ${JSON.stringify(restrictedImports)}
_original_import = __builtins__.__import__ if hasattr(__builtins__, '__import__') else __import__

def _safe_import(name, *args, **kwargs):
    if name in _restricted_modules or name.split('.')[0] in _restricted_modules:
        raise ImportError(f"Module '{name}' is not available in the World Console")
    return _original_import(name, *args, **kwargs)

try:
    __builtins__.__import__ = _safe_import
except:
    pass

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as _e:
    print(f"Error: {_e}")
finally:
    try:
        __builtins__.__import__ = _original_import
    except:
        pass

_flush_result = _bridge.flush()
print("__WORLD_FLUSH__" + _json.dumps(_flush_result))
`
  }

  async function executeWorldCode(code, options = {}) {
    if (!isReady.value && _pythonRunner) {
      await initialize(worldState.player.name || '')
    }
    if (!isReady.value || !_pythonRunner) {
      return { success: false, stdout: '', stderr: 'WorldVM not initialized\n(PythonRunner 尚未加载完成，请稍后再试)', mutations: null }
    }

    isExecuting.value = true
    const tier = options.tier ?? worldState.unlockedTier
    const timeout = options.timeout ?? 8000
    const wrappedCode = _buildSandboxWrapper(code, tier)

    try {
      const result = await _pythonRunner.runCode(wrappedCode, timeout)

      let mutations = null
      const flushMarker = '__WORLD_FLUSH__'
      let visibleStdout = result.stdout || ''

      const flushIdx = visibleStdout.lastIndexOf(flushMarker)
      if (flushIdx >= 0) {
        const flushJson = visibleStdout.slice(flushIdx + flushMarker.length).trim()
        visibleStdout = visibleStdout.slice(0, flushIdx).trimEnd()
        try {
          mutations = JSON.parse(flushJson)
        } catch {}
      }

      if (mutations) {
        _applyMutations(mutations)
      }

      const execEntry = {
        id: `exec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        code,
        stdout: visibleStdout,
        stderr: result.stderr || '',
        success: result.success,
        executionTime: result.executionTime,
        mutations,
        timestamp: Date.now(),
        tier,
      }
      executionHistory.push(execEntry)
      if (executionHistory.length > 200) executionHistory.splice(0, executionHistory.length - 200)
      lastExecutionResult.value = execEntry

      isExecuting.value = false
      return execEntry
    } catch (e) {
      isExecuting.value = false
      return { success: false, stdout: '', stderr: String(e.message || e), mutations: null }
    }
  }

  function _applyMutations(mutations) {
    if (!mutations) return

    for (const change of (mutations.changes || [])) {
      if (change.type === 'property_change') {
        _applyPropertyChange(change)
      } else if (change.type === 'event') {
        worldState.eventLog.push({
          event: change.event,
          data: change.data,
          timestamp: Date.now(),
        })
        if (worldState.eventLog.length > 100) worldState.eventLog.splice(0, worldState.eventLog.length - 100)
      }
    }

    for (const say of (mutations.says || [])) {
      pendingSays.value.push(say)
      _onCharacterSay?.(say.character, say.text)
    }

    for (const unlock of (mutations.unlocks || [])) {
      pendingUnlocks.value.push(unlock)
    }

    for (const learn of (mutations.learns || [])) {
      pendingLearns.value.push(learn)
    }

    for (const disc of (mutations.discoveries || [])) {
      pendingDiscoveries.value.push(disc)
      _onDiscovery?.(disc.secret)
    }

    for (const cmd of (mutations.canvas || [])) {
      pendingCanvasCommands.value.push(cmd)
    }
    if (mutations.canvas?.length) _onCanvasDraw?.(mutations.canvas)

    for (const snd of (mutations.sounds || [])) {
      pendingSounds.value.push(snd)
    }

    for (const fx of (mutations.screen || [])) {
      pendingScreenEffects.value.push(fx)
      _onScreenEffect?.(fx)
    }

    for (const tc of (mutations.time || [])) {
      pendingTimeChanges.value.push(tc)
    }

    for (const nr of (mutations.narrations || [])) {
      pendingNarrations.value.push(nr)
      _onNarrate?.(nr.text)
    }

    for (const item of (mutations.items || [])) {
      pendingItems.value.push(item)
    }

    for (const meta of (mutations.meta || [])) {
      pendingMetaEvents.value.push(meta)
      _onMetaEvent?.(meta)
    }

    _onWorldChange?.(mutations)
  }

  function _applyPropertyChange(change) {
    const { entity_type, entity_id, property: prop, value } = change

    if (entity_type === 'environment' && entity_id === 'sky') {
      worldState.sky[prop] = value
    } else if (entity_type === 'player') {
      worldState.player[prop] = value
    } else if (entity_type === 'character') {
      if (!worldState.characters[entity_id]) {
        worldState.characters[entity_id] = { mood: 'neutral', expression: 'normal', affection: 0 }
      }
      worldState.characters[entity_id][prop] = value
    } else if (entity_type === 'scene') {
      if (!worldState.scenes[entity_id]) {
        worldState.scenes[entity_id] = {}
      }
      worldState.scenes[entity_id][prop] = value
    }
  }

  function unlockTier(tier) {
    if (tier > worldState.unlockedTier) {
      worldState.unlockedTier = tier
    }
  }

  function consumeSays() {
    const says = [...pendingSays.value]
    pendingSays.value = []
    return says
  }

  function consumeUnlocks() {
    const unlocks = [...pendingUnlocks.value]
    pendingUnlocks.value = []
    return unlocks
  }

  function consumeLearns() {
    const learns = [...pendingLearns.value]
    pendingLearns.value = []
    return learns
  }

  function consumeDiscoveries() {
    const discoveries = [...pendingDiscoveries.value]
    pendingDiscoveries.value = []
    return discoveries
  }

  function consumeCanvasCommands() {
    const cmds = [...pendingCanvasCommands.value]
    pendingCanvasCommands.value = []
    return cmds
  }

  function consumeSounds() {
    const snds = [...pendingSounds.value]
    pendingSounds.value = []
    return snds
  }

  function consumeScreenEffects() {
    const fxs = [...pendingScreenEffects.value]
    pendingScreenEffects.value = []
    return fxs
  }

  function consumeTimeChanges() {
    const tcs = [...pendingTimeChanges.value]
    pendingTimeChanges.value = []
    return tcs
  }

  function consumeNarrations() {
    const nrs = [...pendingNarrations.value]
    pendingNarrations.value = []
    return nrs
  }

  function consumeItems() {
    const items = [...pendingItems.value]
    pendingItems.value = []
    return items
  }

  function consumeMetaEvents() {
    const metas = [...pendingMetaEvents.value]
    pendingMetaEvents.value = []
    return metas
  }

  async function syncCharacterState(charId, vnEngineRelationship) {
    if (!isReady.value || !_pythonRunner) return
    const rel = vnEngineRelationship[charId]
    if (!rel) return
    const avg = Math.round((rel.affection + rel.trust + rel.comfort) / 3)
    await _pythonRunner.runCode(
      `_get_character('${charId}')._props['affection'] = ${avg}`
    )
  }

  async function syncPlayerName(name) {
    if (!isReady.value || !_pythonRunner) return
    worldState.player.name = name
    await _pythonRunner.runCode(`player._props['name'] = ${JSON.stringify(name)}`)
  }

  function getAvailableAPIs() {
    const tier = worldState.unlockedTier
    const apis = []
    for (let t = 0; t <= Math.min(tier, 3); t++) {
      apis.push(...(WORLD_API_TIERS[`tier${t}`] || []))
    }
    return apis
  }

  function getAPIDocumentation(tier) {
    const docs = {
      tier0: [
        { name: 'world.sky.color', desc: '设置天空颜色 (CSS色值)', example: 'world.sky.color = "#ff6b6b"' },
        { name: 'world.sky.weather', desc: '设置天气效果', example: 'world.sky.weather = "rain"', values: ['clear', 'rain', 'snow', 'storm', 'sakura', 'fireflies'] },
        { name: 'world.sky.time', desc: '设置时间段', example: 'world.sky.time = "evening"', values: ['day', 'evening', 'night'] },
        { name: 'world.sky.stars', desc: '显示/隐藏星星', example: 'world.sky.stars = True' },
        { name: 'world.player.name', desc: '获取玩家名字', example: 'print(world.player.name)' },
        { name: 'world.player.title', desc: '设置玩家称号', example: 'world.player.title = "Bug Hunter"' },
        { name: 'print()', desc: '在控制台输出文字', example: 'print("Hello World!")' },
        { name: 'world.canvas.circle()', desc: '画圆形', example: 'world.canvas.circle(400, 300, 50, "cyan")' },
        { name: 'world.canvas.rect()', desc: '画矩形', example: 'world.canvas.rect(100, 100, 200, 150, "#FF6B9D")' },
        { name: 'world.canvas.line()', desc: '画线段', example: 'world.canvas.line(0, 0, 800, 600, "gold", 3)' },
        { name: 'world.canvas.text()', desc: '绘制文字', example: 'world.canvas.text(400, 300, "Hello!", "white", 24)' },
        { name: 'world.canvas.heart()', desc: '画心形', example: 'world.canvas.heart(400, 300, 40, "#FF6B9D")' },
        { name: 'world.canvas.star()', desc: '画星形', example: 'world.canvas.star(400, 300, 5, 40, 20, "gold")' },
        { name: 'world.canvas.clear()', desc: '清空画布', example: 'world.canvas.clear()' },
        { name: 'world.canvas.particles', desc: '粒子特效', example: 'world.canvas.particles.hearts(400, 300)' },
        { name: 'world.narrate()', desc: '插入旁白文本', example: 'world.narrate("一阵微风拂过……")' },
      ],
      tier1: [
        { name: 'world.nene', desc: '与音音交互', example: 'world.nene.say("你做到了！")' },
        { name: 'world.nene.mood', desc: '改变音音心情', example: 'world.nene.mood = "happy"', values: ['neutral', 'happy', 'sad', 'surprised', 'angry', 'shy', 'excited'] },
        { name: 'world.classroom', desc: '教室场景', example: 'world.classroom.unlock("secret_board")' },
        { name: 'register_ability()', desc: '注册新能力', example: 'def greet(char):\n    char.say("Hi!")\nregister_ability("greet", greet)' },
        { name: 'use_ability()', desc: '使用已注册的能力', example: 'use_ability("greet", world.nene)' },
        { name: 'world.sound.play()', desc: '播放音效', example: 'world.sound.play("correct")' },
        { name: 'world.sound.bgm()', desc: '切换背景音乐', example: 'world.sound.bgm("morning_fresh")' },
        { name: 'world.spawn_item()', desc: '创建物品', example: 'world.spawn_item("调试之书", "记录了Debug技巧", "📖")' },
      ],
      tier2: [
        { name: 'world.yoshino', desc: '与芳乃交互', example: 'world.yoshino.mood = "impressed"' },
        { name: 'world.ayase', desc: '与绫濑交互', example: 'world.ayase.say("来比赛吧！")' },
        { name: 'trigger_event()', desc: '触发世界事件', example: 'trigger_event("fireworks", color="gold")' },
        { name: 'on_event()', desc: '监听世界事件', example: 'on_event("sunset", lambda: sky.color = "#ff7043")' },
        { name: 'world.screen.shake()', desc: '画面震动', example: 'world.screen.shake(8, 600)' },
        { name: 'world.screen.flash()', desc: '画面闪白', example: 'world.screen.flash("white", 300)' },
        { name: 'world.screen.filter()', desc: '画面滤镜', example: 'world.screen.filter("sepia", 0.8)' },
        { name: 'world.screen.glitch()', desc: '故障特效', example: 'world.screen.glitch(2000, 0.7)' },
        { name: 'world.time.set()', desc: '设置时间', example: 'world.time.set("night")' },
        { name: 'world.time.skip()', desc: '跳过时间', example: 'world.time.skip(hours=3)' },
      ],
      tier3: [
        { name: 'world.kanna', desc: '与栞那交互', example: 'world.kanna.react("warm_smile", "……谢谢")' },
        { name: 'world.murasame', desc: '与村雨交互', example: 'world.murasame.mood = "genuine_smile"' },
        { name: '所有场景', desc: '所有场景对象可用', example: 'world.rooftop.unlock("stargazing_spot")' },
      ],
    }
    const result = []
    for (let t = 0; t <= Math.min(tier ?? worldState.unlockedTier, 3); t++) {
      result.push(...(docs[`tier${t}`] || []))
    }
    return result
  }

  function buildWorldPromptCard() {
    const sky = worldState.sky
    const discoveries = worldState.player.discoveries
    const abilities = worldState.player.abilities
    const events = worldState.eventLog.slice(-5)

    const lines = ['【世界状态卡】']
    lines.push(`天空：${sky.weather === 'clear' ? '晴朗' : sky.weather} | 色调：${sky.color} | 时段：${sky.time}`)
    if (sky.stars) lines.push('星空可见')
    lines.push(`玩家称号：${worldState.player.title}`)
    if (abilities.length > 0) lines.push(`已习得能力：${abilities.join('、')}`)
    if (discoveries.length > 0) lines.push(`已发现的秘密：${discoveries.join('、')}`)
    if (events.length > 0) {
      lines.push(`近期世界事件：${events.map(e => e.event).join('→')}`)
    }
    lines.push(`世界API等级：Tier ${worldState.unlockedTier}（${['基础探索', '初识伙伴', '深入互动', '完全掌控'][worldState.unlockedTier] || '???'}）`)
    return lines.join('\n')
  }

  function getState() {
    return {
      worldState: JSON.parse(JSON.stringify(worldState)),
      executionHistory: executionHistory.slice(-50).map(e => ({
        id: e.id, code: e.code, success: e.success, timestamp: e.timestamp
      })),
    }
  }

  function restoreState(state) {
    if (!state?.worldState) return
    Object.assign(worldState.sky, state.worldState.sky || {})
    Object.assign(worldState.player, state.worldState.player || {})
    worldState.unlockedTier = state.worldState.unlockedTier || 0
    worldState.characters = state.worldState.characters || {}
    worldState.scenes = state.worldState.scenes || {}
    worldState.eventLog = state.worldState.eventLog || []
  }

  return {
    isReady,
    isExecuting,
    worldState,
    pendingSays,
    pendingUnlocks,
    pendingLearns,
    pendingDiscoveries,
    pendingCanvasCommands,
    pendingSounds,
    pendingScreenEffects,
    pendingTimeChanges,
    pendingNarrations,
    pendingItems,
    pendingMetaEvents,
    lastExecutionResult,
    executionHistory,

    initialize,
    bindPythonRunner,
    registerCallbacks,
    executeWorldCode,
    unlockTier,
    syncCharacterState,
    syncPlayerName,

    consumeSays,
    consumeUnlocks,
    consumeLearns,
    consumeDiscoveries,
    consumeCanvasCommands,
    consumeSounds,
    consumeScreenEffects,
    consumeTimeChanges,
    consumeNarrations,
    consumeItems,
    consumeMetaEvents,

    getAvailableAPIs,
    getAPIDocumentation,
    buildWorldPromptCard,

    getState,
    restoreState,
  }
}
