<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function list(Request $request)
    {
        $tasks = $request->user()->tasks();
        if($request->has('q') and strlen($request->q) > 1){
            $withWildcards = "*" . $request->q . "*";
            return response()->json($tasks->whereRaw("MATCH(`title`, `description`) AGAINST (? IN BOOLEAN MODE)",[$withWildcards])->get());
        }else{
            return response()->json($tasks->get());
        }
    }

    public function add(Request $request)
    {
        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description
        ]);
        return response()->json($task);
    }

    public function delete(Request $request, $id)
    {
        $is_deleted = $request->user()->tasks()->where('id', $id)->delete();
        if($is_deleted){
            return response('', 200);
        }else{
            $errors = ['Unable to delete todo'];
            return response()->json($errors, 400);
        }
    }

    public function update(Request $request, $id)
    {
        $is_updated = $request->user()->tasks()->where('id', $id)->update([
            'title' => $request->title,
            'description' => $request->title
        ]);
        if($is_updated){
            return response('', 200);
        }else{
            $errors = ['Unable to Update todo'];
            return response()->json($errors, 400);
        }
    }
}
