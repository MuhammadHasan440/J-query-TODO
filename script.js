let selectedTask = null;

function showToast(msg){ $("#toast").stop(true,true).text(msg).fadeIn(300).delay(2000).fadeOut(300); }

function updateEmptyMessage(){ $("#taskList li").length===0 ? $("#emptyMessage").show() : $("#emptyMessage").hide(); }
function updateTaskCounter(){ let total=$("#taskList li").length, completed=$("#taskList li.done").length, notCompleted=total-completed; $("#taskCounter").text(`Total: ${total} | Completed: ${completed} | Not Completed: ${notCompleted}`); }

function saveTasks(){ localStorage.setItem("tasks", $("#taskList").html()); }

function sendEmail(task,type){
  $.ajax({
    url:"/send-email",
    type:"POST",
    contentType:"application/json",
    data:JSON.stringify({task:`${type}: ${task}`}),
    success:function(res){ if(res.success) showToast(`${type} email sent!`); },
    error:function(){ showToast("Email failed!"); }
  });
}

$(document).ready(function(){
  if(localStorage.getItem("tasks")) $("#taskList").html(localStorage.getItem("tasks"));
  updateEmptyMessage(); updateTaskCounter();
});

// Add task
$("#btnAdd").click(function(){
  let task=$("#taskInput").val().trim();
  if(task===""){ alert("Enter task!"); return; }
  if($("#taskList li:not(.done)").length>=5){ alert("Max 5 incomplete tasks!"); return; }

  $("#taskList").append(`<li>
    <span class="taskText">${task}</span>
    <button class="editBtn">Edit</button>
    <button class="removeBtn">x</button>
  </li>`);

  $("#taskInput").val(""); saveTasks(); updateEmptyMessage(); updateTaskCounter();
  sendEmail(task,"Added");
});

// Complete task
$(document).on("click","li .taskText",function(){
  $(this).parent().toggleClass("done"); saveTasks(); updateEmptyMessage(); updateTaskCounter();
  showToast(`Task ${$(this).parent().hasClass("done") ? "Completed" : "Marked Incomplete"}`);
});

// Remove task
$(document).on("click",".removeBtn",function(){
  let taskText=$(this).siblings(".taskText").text(); $(this).parent().remove(); saveTasks(); updateEmptyMessage(); updateTaskCounter();
  sendEmail(taskText,"Removed"); showToast("Task Removed");
});

// Edit task
$(document).on("click",".editBtn",function(){
  selectedTask=$(this).siblings(".taskText");
  let updated=prompt("Edit task:", selectedTask.text());
  if(updated && updated.trim()!==""){ selectedTask.text(updated.trim()); saveTasks(); updateTaskCounter(); showToast("Task Edited"); }
});

// Clear all
$("#clearAll").click(function(){
  if($("#taskList li").length===0){ alert("List empty!"); return; }
  $("#taskList").empty(); saveTasks(); updateEmptyMessage(); updateTaskCounter(); showToast("All tasks cleared");
});
