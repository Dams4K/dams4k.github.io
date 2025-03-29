@tool
extends Resource
class_name PlanetSettings

@export var size := 128.0
@export var rotation := 0.0
@export var light_origin := Vector2(0.39, 0.39)
@export var time_speed := 2.0
@export var materials: Array[ShaderMaterial] = []
@export var size_factor: Array[float] = []

var time := 0.0

func update_material(mat: ShaderMaterial) -> void:
	mat.set_shader_parameter("pixels", size)
	mat.set_shader_parameter("rotation", rotation)
	mat.set_shader_parameter("light_origin", light_origin)
	

func process_time(delta: float):
	time += time_speed * delta
	for mat: ShaderMaterial in materials:
		mat.set_shader_parameter("time", time * get_multiplier(mat) * 0.01)

func get_multiplier(mat):
	return (round(mat.get_shader_parameter("size")) * 2.0) / mat.get_shader_parameter("time_speed")
