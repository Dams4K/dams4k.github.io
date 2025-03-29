@tool
extends Node2D
class_name Planet

@export_tool_button("Update") var update_action = update_planet
@export var settings: PlanetSettings

var sprites: Array[Sprite2D] = []

var focus_able: FocusAble
var collision_shape: CollisionShape2D
var shape: CircleShape2D

func _ready() -> void:
	create_collision()
	update_planet()

func _process(delta: float) -> void:
	if not Engine.is_editor_hint():
		settings.process_time(delta)

func create_collision():
	focus_able = FocusAble.new()
	collision_shape = CollisionShape2D.new()
	shape = CircleShape2D.new()
	collision_shape.shape = shape
	
	focus_able.add_child(collision_shape)
	add_child(focus_able)
	
	update_collision()

func update_collision():
	
	if shape != null:
		shape.radius = settings.size/2
	

func update_planet() -> void:
	update_collision()
	for i in range(sprites.size()):
		var sprite: Sprite2D = sprites[i]
		sprite.queue_free()
	sprites.clear()
	for mat: ShaderMaterial in settings.materials:
		settings.update_material(mat)
		var sprite := Sprite2D.new()
		var tex := ImageTexture.create_from_image(
			Image.create_empty(settings.size, settings.size, false, Image.FORMAT_ETC)
		)
		sprite.texture = tex
		sprite.material = mat
		
		sprites.append(sprite)
		add_child(sprite)
