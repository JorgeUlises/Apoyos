using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Acciones.Controllers
{
    public class ProyectosController : Controller
    {
        // GET: ProyectosController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ProyectosController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ProyectosController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ProyectosController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ProyectosController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ProyectosController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ProyectosController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ProyectosController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
