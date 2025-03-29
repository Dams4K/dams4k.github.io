@tool
extends Node2D
class_name OrbitalObject

@export var rpm := 10.0
@export var radius := 128.0 : set = set_radius

func _ready() -> void:
	set_radius(radius)


func _process(delta: float) -> void:
	rotation += rpm*2*PI*delta/60
	rotation = fmod(rotation, 2*PI)


func set_radius(value: float) -> void:
	radius = value
	for child in get_children():
		child.position.x = radius
